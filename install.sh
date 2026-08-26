#!/usr/bin/env bash
set -euo pipefail

# ============================================================================
#  Claude Skills Installer
#  Installs every slash command in skills/ plus the agent skills in external/
#
#  Wrapping in main() ensures the entire script is downloaded before
#  execution when running via: curl -fsSL ... | bash
# ============================================================================

main() {

# When piped (curl | bash), clone the repo to a temp directory
if [ ! -t 0 ]; then
    TMPDIR="$(mktemp -d)"
    trap 'rm -rf "$TMPDIR"' EXIT
    echo "   Downloading claude-skills..."
    git clone --depth 1 --quiet https://github.com/sgomez-dev/claude-skills.git "$TMPDIR/claude-skills"
    REPO_DIR="$TMPDIR/claude-skills"
else
    REPO_DIR="$(cd "$(dirname "$0")" && pwd)"
fi
SKILLS_DIR="$REPO_DIR/skills"
EXTERNAL_DIR="$REPO_DIR/external"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m'

print_banner() {
    # Counted at runtime so the banner can't go stale as skills are added.
    local n
    n=$(find "$SKILLS_DIR" -name '*.md' 2>/dev/null | wc -l | tr -d ' ')
    echo ""
    echo -e "${CYAN}${BOLD}"
    echo "   ╔═══════════════════════════════════════════════════════╗"
    echo "   ║                                                       ║"
    echo "   ║            CLAUDE SKILLS INSTALLER                    ║"
    printf "   ║            %-43s║\n" "$n Slash Commands for Claude Code"
    echo "   ║                                                       ║"
    echo "   ╚═══════════════════════════════════════════════════════╝"
    echo -e "${NC}"
}

print_category() {
    local name=$1
    local count=$2
    echo -e "   ${GREEN}+${NC} ${BOLD}$name${NC} ($count skills)"
}

# ============================================================================
#  EXTERNAL AGENT SKILLS
#
#  Third-party skills vendored in external/ use the Agent Skill format
#  (a directory with SKILL.md), so they install to .claude/skills/<name>/
#  instead of .claude/commands/. See external/README.md.
# ============================================================================

# Prints "<name> <source-dir>" for every vendored external skill ready to
# install, from both the committed manifest and the private one. The private
# ones live under external/.local/ and are gitignored — see external/README.md.
list_external_skills() {
    local manifest name
    for manifest in "$EXTERNAL_DIR/sources.txt:$EXTERNAL_DIR" \
                    "$EXTERNAL_DIR/sources.local.txt:$EXTERNAL_DIR/.local"; do
        local file="${manifest%%:*}" base="${manifest##*:}"
        [ -f "$file" ] || continue
        grep -v '^[[:space:]]*#' "$file" | grep -v '^[[:space:]]*$' | cut -d'|' -f1 |
            while read -r name; do
                [ -f "$base/$name/SKILL.md" ] && echo "$name $base/$name"
            done
    done
}

install_external_to_target() {
    local target="$1"
    local entries count=0 name src
    entries="$(list_external_skills)"
    [ -n "$entries" ] || return 0

    mkdir -p "$target"
    while read -r name src; do
        [ -n "$name" ] || continue
        rm -rf "$target/$name"
        mkdir -p "$target/$name"
        cp -R "$src/." "$target/$name/"
        count=$((count + 1))
        case "$src" in
            */.local/*) echo -e "   ${GREEN}+${NC} ${BOLD}$name${NC} (external agent skill, ${YELLOW}private${NC})" ;;
            *)          echo -e "   ${GREEN}+${NC} ${BOLD}$name${NC} (external agent skill)" ;;
        esac
    done <<< "$entries"

    echo -e "   ${CYAN}$count agent skill(s) -> $target${NC}"
}

# Maps a commands dir (…/.claude/commands) to its sibling skills dir.
skills_target_for() {
    echo "${1%/commands}/skills"
}

# ============================================================================
#  INSTALLATION MODES
# ============================================================================

install_to_target() {
    local target="$1"
    local label="$2"
    echo -e "\n${BLUE}[$label]${NC} Installing to ${BOLD}$target${NC}\n"
    mkdir -p "$target"

    local count=0
    for category_dir in "$SKILLS_DIR"/*/; do
        local category=$(basename "$category_dir")
        local cat_count=0
        for skill_file in "$category_dir"*.md; do
            [ -f "$skill_file" ] || continue
            local skill_name=$(basename "$skill_file" .md)
            local dest_name="${category}--${skill_name}.md"
            cp "$skill_file" "$target/$dest_name"
            count=$((count + 1))
            cat_count=$((cat_count + 1))
        done
        print_category "$category" "$cat_count"
    done

    echo -e "\n${GREEN}${BOLD}   $count skills installed!${NC}"
    if [[ "$label" == "Global Install" ]]; then
        echo -e "   Available in ALL your projects as ${CYAN}/category--skill${NC}"
    else
        echo -e "   Available in this project as ${CYAN}/project:category--skill${NC}"
    fi

    if [ -n "$(list_external_skills)" ]; then
        echo ""
        install_external_to_target "$(skills_target_for "$target")"
        echo -e "   Invoked as ${CYAN}/skill-name${NC}, or auto-triggered by description"
    fi
}

install_global() {
    install_to_target "$HOME/.claude/commands" "Global Install"
}

install_project() {
    install_to_target "./.claude/commands" "Project Install"
}

ask_scope() {
    echo -e "\n   Install to:" >&2
    echo -e "   ${BOLD}1)${NC} Global  - ~/.claude/commands (all projects)" >&2
    echo -e "   ${BOLD}2)${NC} Project - .claude/commands (this project only)\n" >&2
    read -rp "   Choose [1-2]: " scope </dev/tty

    if [[ "$scope" == "2" ]]; then
        echo "./.claude/commands"
    else
        echo "$HOME/.claude/commands"
    fi
}

install_selective() {
    local target
    target=$(ask_scope)
    local scope_label="Global Install"
    [[ "$target" == "./.claude/commands" ]] && scope_label="Project Install"

    echo -e "\n${BLUE}[Selective Install]${NC} Choose categories to install:\n"

    local categories=()
    local i=1
    for category_dir in "$SKILLS_DIR"/*/; do
        local category=$(basename "$category_dir")
        local count=$(find "$category_dir" -name "*.md" | wc -l)
        echo -e "   ${BOLD}$i)${NC} $category ($count skills)"
        categories+=("$category")
        i=$((i + 1))
    done

    local ext_count
    ext_count=$(list_external_skills | wc -l | tr -d ' ')
    if [ "$ext_count" -gt 0 ]; then
        echo -e "   ${BOLD}$i)${NC} external ($ext_count agent skills)"
        categories+=("__external__")
        i=$((i + 1))
    fi

    echo -e "\n   Enter numbers separated by spaces (e.g., 1 3 5 7):"
    echo -e "   Or ${BOLD}'all'${NC} to install everything\n"
    read -rp "   > " selection </dev/tty

    if [[ "$selection" == "all" ]]; then
        install_to_target "$target" "$scope_label"
        return
    fi

    mkdir -p "$target"
    local count=0

    for num in $selection; do
        local idx=$((num - 1))
        if [[ $idx -ge 0 && $idx -lt ${#categories[@]} ]]; then
            local category="${categories[$idx]}"

            if [[ "$category" == "__external__" ]]; then
                install_external_to_target "$(skills_target_for "$target")"
                continue
            fi

            local category_dir="$SKILLS_DIR/$category"
            for skill_file in "$category_dir"/*.md; do
                [ -f "$skill_file" ] || continue
                local skill_name=$(basename "$skill_file" .md)
                cp "$skill_file" "$target/${category}--${skill_name}.md"
                count=$((count + 1))
            done
            echo -e "   ${GREEN}+${NC} Installed ${BOLD}$category${NC}"
        fi
    done

    echo -e "\n${GREEN}${BOLD}   $count skills installed!${NC}"
}

uninstall() {
    echo -e "\n${YELLOW}[Uninstall]${NC} Removing claude-skills commands...\n"

    local global_dir="$HOME/.claude/commands"
    local project_dir=".claude/commands"
    local count=0

    for dir in "$global_dir" "$project_dir"; do
        if [ -d "$dir" ]; then
            for f in "$dir"/*--*.md; do
                [ -f "$f" ] || continue
                rm "$f"
                count=$((count + 1))
            done
        fi
    done

    echo -e "   ${GREEN}Removed $count skill files.${NC}"

    # External agent skills live in .claude/skills/<name>/ — only remove the
    # directories this repo vendors, and only if they really are skill dirs.
    local ext_names ext_count=0
    ext_names="$(list_external_skills)"
    if [ -n "$ext_names" ]; then
        for dir in "$HOME/.claude/skills" ".claude/skills"; do
            [ -d "$dir" ] || continue
            while read -r name src; do
                [ -n "$name" ] || continue
                if [ -f "$dir/$name/SKILL.md" ]; then
                    rm -rf "$dir/$name"
                    ext_count=$((ext_count + 1))
                    echo -e "   ${YELLOW}-${NC} $dir/$name"
                fi
            done <<< "$ext_names"
        done
        echo -e "   ${GREEN}Removed $ext_count external agent skill(s).${NC}"
    fi
}

# ============================================================================
#  MAIN
# ============================================================================

print_banner

echo -e "   ${BOLD}How would you like to install?${NC}\n"
echo -e "   ${BOLD}1)${NC} Global     - Available in ALL projects      ${CYAN}(recommended)${NC}"
echo -e "   ${BOLD}2)${NC} Project    - Only in current project directory"
echo -e "   ${BOLD}3)${NC} Selective  - Choose specific categories"
echo -e "   ${BOLD}4)${NC} Uninstall  - Remove installed skills"
echo ""
read -rp "   Choose [1-4]: " choice </dev/tty

case $choice in
    1) install_global ;;
    2) install_project ;;
    3) install_selective ;;
    4) uninstall ;;
    *) echo -e "\n   ${RED}Invalid choice.${NC}"; exit 1 ;;
esac

echo -e "\n${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "   ${BOLD}Usage:${NC} Type ${CYAN}/${NC} in Claude Code to see all available commands"
echo -e "   ${BOLD}Example:${NC} ${CYAN}/git--commit${NC}, ${CYAN}/security--audit${NC}, ${CYAN}/test--gen${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"

} # end main

main "$@"
