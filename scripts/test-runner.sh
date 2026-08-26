#!/usr/bin/env bash
set -euo pipefail

# ============================================================================
#  Claude Skills Test Runner
#  Validates every skill for: structure, permissions, triggers, safety
# ============================================================================

REPO_DIR="$(cd "$(dirname "$0")/.." && pwd)"
SKILLS_DIR="$REPO_DIR/skills"
TESTS_DIR="$REPO_DIR/tests"

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m'

TOTAL=0
PASSED=0
WARNED=0
FAILED=0

pass()  { PASSED=$((PASSED + 1)); echo -e "  ${GREEN}PASS${NC} $1"; }
warn()  { WARNED=$((WARNED + 1)); echo -e "  ${YELLOW}WARN${NC} $1"; }
fail()  { FAILED=$((FAILED + 1)); echo -e "  ${RED}FAIL${NC} $1"; }

echo -e "${CYAN}${BOLD}"
echo "  ╔═════════════════════════════════════════╗"
echo "  ║       CLAUDE SKILLS TEST RUNNER         ║"
echo "  ╚═════════════════════════════════════════╝"
echo -e "${NC}"

# ============================================================================
#  TEST 1: Structure Validation
# ============================================================================
echo -e "${BOLD}[1/5] Structure Validation${NC}"

for skill_file in "$SKILLS_DIR"/**/*.md; do
    [ -f "$skill_file" ] || continue
    TOTAL=$((TOTAL + 1))
    rel_path="${skill_file#$REPO_DIR/}"

    # Check frontmatter exists
    if ! head -1 "$skill_file" | grep -q '^---'; then
        fail "$rel_path — missing frontmatter"
        continue
    fi

    # Check description exists
    if ! grep -q '^description:' "$skill_file"; then
        fail "$rel_path — missing description in frontmatter"
        continue
    fi

    # Check description is not empty
    desc=$(grep '^description:' "$skill_file" | sed 's/^description: *//')
    if [ -z "$desc" ]; then
        fail "$rel_path — empty description"
        continue
    fi

    # Check has $ARGUMENTS
    if ! grep -q '\$ARGUMENTS' "$skill_file"; then
        warn "$rel_path — no \$ARGUMENTS placeholder"
    fi

    # Check has actual content (not just frontmatter)
    content_lines=$(sed -n '/^---$/,/^---$/!p' "$skill_file" | sed '1d' | wc -l)
    if [ "$content_lines" -lt 3 ]; then
        fail "$rel_path — too little content ($content_lines lines)"
        continue
    fi

    pass "$rel_path"
done

# ============================================================================
#  TEST 2: Permission Manifest Validation
# ============================================================================
echo ""
echo -e "${BOLD}[2/5] Permission Manifest Validation${NC}"

PERM_TOTAL=0
PERM_FOUND=0

for skill_file in "$SKILLS_DIR"/**/*.md; do
    [ -f "$skill_file" ] || continue
    PERM_TOTAL=$((PERM_TOTAL + 1))
    rel_path="${skill_file#$REPO_DIR/}"

    if grep -q '^permissions:' "$skill_file"; then
        PERM_FOUND=$((PERM_FOUND + 1))
        pass "$rel_path — has permission manifest"
    else
        warn "$rel_path — no permission manifest"
    fi
done

echo -e "  ${CYAN}Permission coverage: $PERM_FOUND/$PERM_TOTAL skills${NC}"

# ============================================================================
#  TEST 3: Safety Lint
# ============================================================================
echo ""
echo -e "${BOLD}[3/5] Safety Lint${NC}"

DANGEROUS_PATTERNS=(
    'rm -rf /'
    'curl.*| *bash'
    'curl.*| *sh'
    'wget.*| *bash'
    'eval('
    '> /dev/sda'
    'mkfs\.'
    'dd if='
    ':(){:|:&};:'
    'chmod 777'
    '--no-verify'
    '--force-with-lease'
)

for skill_file in "$SKILLS_DIR"/**/*.md; do
    [ -f "$skill_file" ] || continue
    rel_path="${skill_file#$REPO_DIR/}"
    is_safe=true

    for pattern in "${DANGEROUS_PATTERNS[@]}"; do
        if grep -qi "$pattern" "$skill_file" 2>/dev/null; then
            fail "$rel_path — contains dangerous pattern: $pattern"
            is_safe=false
        fi
    done

    if $is_safe; then
        pass "$rel_path — safe"
    fi
done

# ============================================================================
#  TEST 4: Trigger Quality
# ============================================================================
echo ""
echo -e "${BOLD}[4/5] Trigger Quality${NC}"

for skill_file in "$SKILLS_DIR"/**/*.md; do
    [ -f "$skill_file" ] || continue
    rel_path="${skill_file#$REPO_DIR/}"

    desc=$(grep '^description:' "$skill_file" | sed 's/^description: *//')
    desc_len=${#desc}

    if [ "$desc_len" -lt 10 ]; then
        fail "$rel_path — description too short ($desc_len chars) for reliable triggering"
    elif [ "$desc_len" -gt 100 ]; then
        warn "$rel_path — description very long ($desc_len chars), may dilute trigger matching"
    else
        pass "$rel_path — description length OK ($desc_len chars)"
    fi
done

# ============================================================================
#  TEST 5: Test Coverage (check for .test.yaml files)
# ============================================================================
echo ""
echo -e "${BOLD}[5/5] Test File Coverage${NC}"

TEST_TOTAL=0
TEST_FOUND=0

for skill_file in "$SKILLS_DIR"/**/*.md; do
    [ -f "$skill_file" ] || continue
    TEST_TOTAL=$((TEST_TOTAL + 1))
    rel_path="${skill_file#$REPO_DIR/}"
    test_file="${skill_file%.md}.test.yaml"

    if [ -f "$test_file" ]; then
        TEST_FOUND=$((TEST_FOUND + 1))
        pass "$rel_path — has test file"
    fi
done

echo -e "  ${CYAN}Test coverage: $TEST_FOUND/$TEST_TOTAL skills${NC}"

# ============================================================================
#  SUMMARY
# ============================================================================
echo ""
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BOLD}  RESULTS${NC}"
echo -e "  Skills tested:    $TOTAL"
echo -e "  ${GREEN}Passed:           $PASSED${NC}"
echo -e "  ${YELLOW}Warnings:         $WARNED${NC}"
echo -e "  ${RED}Failed:           $FAILED${NC}"
echo -e "  Permission coverage: $PERM_FOUND/$PERM_TOTAL"
echo -e "  Test file coverage:  $TEST_FOUND/$TEST_TOTAL"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

if [ "$FAILED" -gt 0 ]; then
    echo -e "\n  ${RED}${BOLD}$FAILED failures found.${NC}"
    exit 1
else
    echo -e "\n  ${GREEN}${BOLD}All checks passed!${NC}"
    exit 0
fi
