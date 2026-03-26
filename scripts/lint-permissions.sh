#!/usr/bin/env bash
set -euo pipefail

# ============================================================================
#  Permission Manifest Linter
#  Cross-references declared permissions against actual skill content
# ============================================================================

REPO_DIR="$(cd "$(dirname "$0")/.." && pwd)"
SKILLS_DIR="$REPO_DIR/skills"

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m'

ISSUES=0

echo -e "${CYAN}${BOLD}"
echo "  ╔═════════════════════════════════════════╗"
echo "  ║     PERMISSION MANIFEST LINTER          ║"
echo "  ╚═════════════════════════════════════════╝"
echo -e "${NC}"

# Command patterns and what permission they require
declare -A CMD_PERMISSIONS=(
    ["git commit"]="commands_git"
    ["git push"]="commands_git,destructive_push"
    ["git reset --hard"]="destructive"
    ["git force"]="destructive"
    ["rm -rf"]="destructive"
    ["npm publish"]="network,destructive"
    ["docker"]="commands_docker"
    ["kubectl"]="commands_k8s"
    ["terraform"]="commands_terraform"
    ["curl"]="network"
    ["fetch"]="network"
    ["wget"]="network"
)

for skill_file in "$SKILLS_DIR"/**/*.md; do
    [ -f "$skill_file" ] || continue
    rel_path="${skill_file#$REPO_DIR/}"

    # Extract permissions block
    has_perms=false
    declares_destructive=false
    declares_network=false

    if grep -q '^permissions:' "$skill_file"; then
        has_perms=true
        if grep -q 'destructive: true' "$skill_file"; then
            declares_destructive=true
        fi
        if grep -q 'network: true' "$skill_file"; then
            declares_network=true
        fi
    fi

    # Check content for patterns that need permissions
    content=$(cat "$skill_file")

    # Check for destructive operations
    if echo "$content" | grep -qi 'git reset --hard\|git push --force\|rm -rf\|drop table\|force.push\|--force\|DELETE FROM\|destroy\|terraform destroy'; then
        if $has_perms && ! $declares_destructive; then
            echo -e "  ${RED}MISMATCH${NC} $rel_path"
            echo -e "           Contains destructive operations but permissions.destructive != true"
            ISSUES=$((ISSUES + 1))
        elif ! $has_perms; then
            echo -e "  ${YELLOW}MISSING${NC}  $rel_path"
            echo -e "           Contains destructive operations but has no permission manifest"
            ISSUES=$((ISSUES + 1))
        fi
    fi

    # Check for network operations
    if echo "$content" | grep -qi 'curl \|wget \|fetch(\|api call\|network request\|http://\|https://\|npm publish\|docker push'; then
        if $has_perms && ! $declares_network; then
            echo -e "  ${RED}MISMATCH${NC} $rel_path"
            echo -e "           References network operations but permissions.network != true"
            ISSUES=$((ISSUES + 1))
        fi
    fi

    # If skill has no issues and has permissions
    if $has_perms; then
        echo -e "  ${GREEN}OK${NC}       $rel_path"
    fi
done

echo ""
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
if [ "$ISSUES" -gt 0 ]; then
    echo -e "  ${RED}${BOLD}$ISSUES permission issues found${NC}"
    exit 1
else
    echo -e "  ${GREEN}${BOLD}All permission manifests valid!${NC}"
    exit 0
fi
