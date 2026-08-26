#!/usr/bin/env bash
set -euo pipefail

# ============================================================================
#  sync-external.sh
#  Vendors third-party Agent Skills from their upstream git repos into
#  external/, driven by external/sources.txt.
#
#  Usage:
#    ./scripts/sync-external.sh                 Sync every source
#    ./scripts/sync-external.sh <name> [name…]  Sync only the named source(s)
#    ./scripts/sync-external.sh --check         Report what's behind upstream
#    ./scripts/sync-external.sh --list          List manifest entries
# ============================================================================

REPO_DIR="$(cd "$(dirname "$0")/.." && pwd)"
EXTERNAL_DIR="$REPO_DIR/external"
MANIFEST="$EXTERNAL_DIR/sources.txt"

# Colors only on a terminal — keeps piped output (CI logs, issue bodies) clean.
if [ -t 1 ]; then
    RED='\033[0;31m'
    GREEN='\033[0;32m'
    YELLOW='\033[1;33m'
    BLUE='\033[0;34m'
    CYAN='\033[0;36m'
    DIM='\033[2m'
    BOLD='\033[1m'
    NC='\033[0m'
else
    RED='' GREEN='' YELLOW='' BLUE='' CYAN='' DIM='' BOLD='' NC=''
fi

die() { echo -e "${RED}error:${NC} $*" >&2; exit 1; }

usage() {
    sed -n '5,13p' "$0" | sed -e 's/^#$//' -e 's/^#  \{0,1\}//'
    exit 0
}

[ -f "$MANIFEST" ] || die "manifest not found: $MANIFEST"
command -v git >/dev/null 2>&1 || die "git is required"

TMPROOT="$(mktemp -d)"
trap 'rm -rf "$TMPROOT"' EXIT

# ----------------------------------------------------------------------------
#  Manifest parsing
# ----------------------------------------------------------------------------

# Emits "name|url|ref|subpath" for each real entry (comments/blanks stripped).
read_manifest() {
    grep -v '^[[:space:]]*#' "$MANIFEST" | grep -v '^[[:space:]]*$' || true
}

manifest_line_for() {
    local want="$1" line
    while IFS= read -r line; do
        [ -n "$line" ] || continue
        if [ "${line%%|*}" = "$want" ]; then
            printf '%s\n' "$line"
            return 0
        fi
    done < <(read_manifest)
    return 1
}

# Commit SHA currently vendored, read back from the generated UPSTREAM.md.
recorded_sha() {
    local name="$1" file="$EXTERNAL_DIR/$name/UPSTREAM.md"
    [ -f "$file" ] || return 0
    sed -n 's/^- Vendored commit: `\([0-9a-f]\{7,40\}\)`.*/\1/p' "$file" | head -1
}

remote_sha() {
    local url="$1" ref="$2"
    git ls-remote "$url" "refs/heads/$ref" "refs/tags/$ref" 2>/dev/null \
        | head -1 | cut -f1
}

# ----------------------------------------------------------------------------
#  Actions
# ----------------------------------------------------------------------------

list_sources() {
    echo -e "\n${BOLD}External skill sources${NC} ${DIM}($MANIFEST)${NC}\n"
    local name url ref subpath sha
    while IFS='|' read -r name url ref subpath; do
        [ -n "${name:-}" ] || continue
        sha="$(recorded_sha "$name")"
        echo -e "   ${CYAN}$name${NC}"
        echo -e "     repo:     $url ${DIM}($ref)${NC}"
        echo -e "     subpath:  ${subpath}"
        if [ -n "$sha" ]; then
            echo -e "     vendored: ${sha:0:7}"
        else
            echo -e "     vendored: ${YELLOW}not synced yet${NC}"
        fi
        echo ""
    done < <(read_manifest)
}

check_one() {
    local name="$1" url="$2" ref="$3"
    local local_sha remote

    local_sha="$(recorded_sha "$name")"
    remote="$(remote_sha "$url" "$ref")"

    if [ -z "$remote" ]; then
        echo -e "   ${RED}?${NC} ${BOLD}$name${NC} — could not reach $url ($ref)"
        return 1
    fi
    if [ -z "$local_sha" ]; then
        echo -e "   ${YELLOW}+${NC} ${BOLD}$name${NC} — not vendored yet ${DIM}(upstream ${remote:0:7})${NC}"
        return 2
    fi
    if [ "$local_sha" = "$remote" ]; then
        echo -e "   ${GREEN}=${NC} ${BOLD}$name${NC} — up to date ${DIM}(${local_sha:0:7})${NC}"
        return 0
    fi
    echo -e "   ${YELLOW}^${NC} ${BOLD}$name${NC} — behind upstream ${DIM}(${local_sha:0:7} -> ${remote:0:7})${NC}"
    return 2
}

sync_one() {
    local name="$1" url="$2" ref="$3" subpath="$4"
    local dest="$EXTERNAL_DIR/$name"
    local before after tmp src staged prev_synced=""

    before="$(recorded_sha "$name")"
    if [ -f "$dest/UPSTREAM.md" ]; then
        prev_synced="$(sed -n 's/^- Synced: //p' "$dest/UPSTREAM.md" | head -1)"
    fi

    tmp="$TMPROOT/$name"
    rm -rf "$tmp"
    mkdir -p "$tmp"

    echo -e "\n${BLUE}[$name]${NC} cloning $url ${DIM}($ref)${NC}"
    if ! git clone --depth 1 --branch "$ref" --quiet "$url" "$tmp/repo" 2>/dev/null; then
        echo -e "   ${RED}FAIL${NC} clone failed — leaving the existing copy untouched"
        return 1
    fi

    after="$(git -C "$tmp/repo" rev-parse HEAD)"
    local commit_date
    commit_date="$(git -C "$tmp/repo" log -1 --format='%cI')"

    src="$tmp/repo/$subpath"
    [ -d "$src" ] || { echo -e "   ${RED}FAIL${NC} subpath not found in repo: $subpath"; return 1; }
    [ -f "$src/SKILL.md" ] || {
        echo -e "   ${RED}FAIL${NC} no SKILL.md at $subpath — one manifest entry must point at one skill directory"
        return 1
    }

    # Stage the new copy first, so a partial failure can't destroy the old one.
    staged="$tmp/staged"
    mkdir -p "$staged"
    cp -R "$src/." "$staged/"
    rm -rf "$staged/.git"

    # Carry the upstream license along for attribution if the skill dir has none.
    if [ ! -f "$staged/LICENSE" ]; then
        for candidate in LICENSE LICENSE.md LICENSE.txt COPYING; do
            if [ -f "$tmp/repo/$candidate" ]; then
                cp "$tmp/repo/$candidate" "$staged/LICENSE"
                break
            fi
        done
    fi

    # Re-syncing an unchanged commit keeps the original timestamp, so an
    # idempotent sync leaves no diff to review.
    local synced
    if [ "$before" = "$after" ] && [ -n "$prev_synced" ]; then
        synced="$prev_synced"
    else
        synced="$(date -u '+%Y-%m-%dT%H:%M:%SZ')"
    fi

    write_upstream_md "$staged/UPSTREAM.md" "$name" "$url" "$ref" "$after" "$commit_date" "$subpath" "$synced"

    rm -rf "$dest"
    mkdir -p "$(dirname "$dest")"
    mv "$staged" "$dest"

    local files
    files="$(find "$dest" -type f | wc -l | tr -d ' ')"
    if [ -z "$before" ]; then
        echo -e "   ${GREEN}NEW${NC}  vendored at ${after:0:7} ${DIM}($files files)${NC}"
    elif [ "$before" = "$after" ]; then
        echo -e "   ${GREEN}OK${NC}   already at ${after:0:7} ${DIM}($files files, re-copied)${NC}"
    else
        echo -e "   ${GREEN}UPD${NC}  ${before:0:7} -> ${after:0:7} ${DIM}($files files)${NC}"
    fi
}

write_upstream_md() {
    local file="$1" name="$2" url="$3" ref="$4" sha="$5" commit_date="$6" subpath="$7" synced="$8"
    local browse_url="${url%.git}"

    cat > "$file" <<EOF
# Upstream provenance — $name

This directory is a **vendored copy** of a third-party Agent Skill. It is not
authored here.

- Source repo: <$browse_url>
- Tracked ref: \`$ref\`
- Upstream path: \`$subpath\`
- Vendored commit: \`$sha\`
- Commit date: $commit_date
- Synced: $synced

## Do not edit by hand

Local changes are overwritten on the next sync. To pull upstream changes:

\`\`\`bash
./scripts/sync-external.sh $name
\`\`\`

If you need behaviour that differs from upstream, either open a PR upstream or
fork the repo and point \`external/sources.txt\` at your fork.

License: see \`LICENSE\` in this directory (the upstream project's terms apply
to this copy).
EOF
}

# ----------------------------------------------------------------------------
#  Main
# ----------------------------------------------------------------------------

MODE="sync"
TARGETS=()

for arg in "$@"; do
    case "$arg" in
        -h|--help) usage ;;
        --check)   MODE="check" ;;
        --list)    MODE="list" ;;
        -*)        die "unknown flag: $arg" ;;
        *)         TARGETS+=("$arg") ;;
    esac
done

if [ "$MODE" = "list" ]; then
    list_sources
    exit 0
fi

# Resolve which manifest entries to act on.
ENTRIES=()
if [ ${#TARGETS[@]} -gt 0 ]; then
    for t in "${TARGETS[@]}"; do
        entry="$(manifest_line_for "$t")" || die "no such source in manifest: $t (try --list)"
        ENTRIES+=("$entry")
    done
else
    while IFS= read -r line; do
        [ -n "$line" ] && ENTRIES+=("$line")
    done < <(read_manifest)
fi

[ ${#ENTRIES[@]} -gt 0 ] || die "manifest has no entries"

if [ "$MODE" = "check" ]; then
    echo -e "\n${BOLD}Checking external skills against upstream${NC}\n"
    stale=0
    for entry in "${ENTRIES[@]}"; do
        IFS='|' read -r name url ref subpath <<< "$entry"
        check_one "$name" "$url" "$ref" || stale=1
    done
    echo ""
    if [ "$stale" -eq 1 ]; then
        echo -e "   ${YELLOW}Updates available.${NC} Run: ${CYAN}./scripts/sync-external.sh${NC}\n"
        exit 1
    fi
    echo -e "   ${GREEN}Everything is up to date.${NC}\n"
    exit 0
fi

FAILED=0
for entry in "${ENTRIES[@]}"; do
    IFS='|' read -r name url ref subpath <<< "$entry"
    sync_one "$name" "$url" "$ref" "$subpath" || FAILED=$((FAILED + 1))
done

echo ""
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
if [ "$FAILED" -gt 0 ]; then
    echo -e "   ${RED}${BOLD}$FAILED source(s) failed to sync.${NC}"
else
    echo -e "   ${GREEN}${BOLD}Sync complete.${NC}"
fi
echo -e "   Review the diff:  ${CYAN}git status --short external/${NC}"
echo -e "   Reinstall locally: ${CYAN}./install.sh${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

[ "$FAILED" -eq 0 ]
