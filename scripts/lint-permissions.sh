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

# NOTE: the destructive/network patterns this linter actually enforces are the
# greps below. An associative-array lookup table used to live here but was never
# referenced, and `declare -A` aborts the whole script under bash 3.2 (macOS
# system bash), so running this locally always failed. Extend the greps instead.

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
    # A bare "destroy" used to be listed here, but it matched English prose
    # ("fake scarcity destroys trust"), flagging 4 skills that run nothing
    # destructive. Destructive *commands* need a command prefix to match.
    if echo "$content" | grep -qi 'git reset --hard\|git push --force\|rm -rf\|drop table\|force.push\|--force\|DELETE FROM\|terraform destroy'; then
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
    # Only match actual executable commands, not descriptive references like "API calls" in text
    if echo "$content" | grep -qi '`curl \|`wget \|`fetch(\|npm publish\|docker push\|requests\.get\|requests\.post\|axios\.\|urllib'; then
        if $has_perms && ! $declares_network; then
            echo -e "  ${RED}MISMATCH${NC} $rel_path"
            echo -e "           Contains network commands but permissions.network != true"
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
