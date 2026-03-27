#!/usr/bin/env bash
set -euo pipefail

# ============================================================================
#  Claude Skills Installer
#  Installs 95 custom slash commands for Claude Code
# ============================================================================

# Detect if running via pipe (curl | bash)
PIPED=false
if [ ! -t 0 ]; then
    PIPED=true
fi

# When piped, clone the repo to a temp directory
if $PIPED; then
    TMPDIR="$(mktemp -d)"
    trap 'rm -rf "$TMPDIR"' EXIT
    git clone --depth 1 --quiet https://github.com/sgomez-dev/claude-skills.git "$TMPDIR/claude-skills"
    REPO_DIR="$TMPDIR/claude-skills"
else
    REPO_DIR="$(cd "$(dirname "$0")" && pwd)"
fi
SKILLS_DIR="$REPO_DIR/skills"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m'

print_banner() {
    echo ""
    echo -e "${CYAN}${BOLD}"
    echo "   ╔═══════════════════════════════════════════════════════╗"
    echo "   ║                                                       ║"
    echo "   ║            CLAUDE SKILLS INSTALLER                    ║"
    echo "   ║            95 Slash Commands for Claude Code          ║"
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
#  INSTALLATION MODES
# ============================================================================

install_global() {
    local target="$HOME/.claude/commands"
    echo -e "\n${BLUE}[Global Install]${NC} Installing to ${BOLD}$target${NC}\n"
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

    echo -e "\n${GREEN}${BOLD}   $count skills installed globally!${NC}"
    echo -e "   Available in ALL your projects as ${CYAN}/category--skill${NC}"
}

install_project() {
    local project_dir="${1:-.}"
    local target="$project_dir/.claude/commands"
    echo -e "\n${BLUE}[Project Install]${NC} Installing to ${BOLD}$target${NC}\n"
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

    echo -e "\n${GREEN}${BOLD}   $count skills installed to project!${NC}"
    echo -e "   Available in this project as ${CYAN}/project:category--skill${NC}"
}

install_selective() {
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

    echo -e "\n   Enter numbers separated by spaces (e.g., 1 3 5 7):"
    echo -e "   Or ${BOLD}'all'${NC} to install everything\n"
    read -rp "   > " selection </dev/tty

    if [[ "$selection" == "all" ]]; then
        install_global
        return
    fi

    local target="$HOME/.claude/commands"
    mkdir -p "$target"
    local count=0

    for num in $selection; do
        local idx=$((num - 1))
        if [[ $idx -ge 0 && $idx -lt ${#categories[@]} ]]; then
            local category="${categories[$idx]}"
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
