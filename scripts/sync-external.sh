#!/usr/bin/env bash
set -euo pipefail

# ============================================================================
#  sync-external.sh
#  Vendors third-party Agent Skills from their upstream git repos, driven by
#  external/sources.txt (committed) and external/sources.local.txt (private).
#
#  Usage:
#    ./scripts/sync-external.sh                 Sync every source
#    ./scripts/sync-external.sh <name> [name…]  Sync only the named source(s)
#    ./scripts/sync-external.sh --check         Report what's behind upstream
#    ./scripts/sync-external.sh --list          List manifest entries
#
#  Two manifests, two destinations:
#    sources.txt        -> external/<name>/         committed and published
#    sources.local.txt  -> external/.local/<name>/  gitignored, never published
#
#  The local manifest exists for skills we may use but must not redistribute:
#  no upstream LICENSE, or a copyleft one incompatible with this repo's MIT.
#  Private use is not distribution. Both install the same way.
# ============================================================================

REPO_DIR="$(cd "$(dirname "$0")/.." && pwd)"
EXTERNAL_DIR="$REPO_DIR/external"
MANIFEST="$EXTERNAL_DIR/sources.txt"
MANIFEST_LOCAL="$EXTERNAL_DIR/sources.local.txt"
LOCAL_DIR="$EXTERNAL_DIR/.local"

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
    sed -n '5,20p' "$0" | sed -e 's/^#$//' -e 's/^#  \{0,1\}//'
    exit 0
}

[ -f "$MANIFEST" ] || die "manifest not found: $MANIFEST"
command -v git >/dev/null 2>&1 || die "git is required"

TMPROOT="$(mktemp -d)"
trap 'rm -rf "$TMPROOT"' EXIT

# ----------------------------------------------------------------------------
#  Manifest parsing
# ----------------------------------------------------------------------------

strip_comments() {
    grep -v '^[[:space:]]*#' "$1" 2>/dev/null | grep -v '^[[:space:]]*$' || true
}

# Public entries as written: "name|url|ref|subpath".
read_manifest() { strip_comments "$MANIFEST"; }

# Local entries as written, or nothing if there is no local manifest.
read_manifest_local() {
    [ -f "$MANIFEST_LOCAL" ] || return 0
    strip_comments "$MANIFEST_LOCAL"
}

# Every entry from both manifests as "name|url|ref|subpath|scope",
# scope being "public" or "local".
read_entries() {
    read_manifest       | sed 's/$/|public/'
    read_manifest_local | sed 's/$/|local/'
}

# Where a given entry's vendored copy lives.
dest_for() {
    local name="$1" scope="$2"
    if [ "$scope" = "local" ]; then
        printf '%s\n' "$LOCAL_DIR/$name"
    else
        printf '%s\n' "$EXTERNAL_DIR/$name"
    fi
}

# A duplicate name would make two entries fight over one destination — and one
# ~/.claude/skills/<name> after install — with the later sync silently winning.
# Names must be unique across BOTH manifests, since both install side by side.
validate_manifest() {
    local dupes bad
    dupes="$(read_entries | cut -d'|' -f1 | sort | uniq -d)"
    if [ -n "$dupes" ]; then
        echo -e "${RED}error:${NC} duplicate names across the manifests:" >&2
        echo "$dupes" | sed 's/^/  /' >&2
        echo "  Each name owns one directory and one installed skill — rename one." >&2
        exit 1
    fi

    bad="$(read_entries | awk -F'|' 'NF!=5 || $1=="" || $2=="" || $3=="" || $4=="" {print $0}')"
    if [ -n "$bad" ]; then
        echo -e "${RED}error:${NC} malformed entries (want name|url|ref|subpath):" >&2
        echo "$bad" | sed 's/|public$//; s/|local$//; s/^/  /' >&2
        exit 1
    fi
}

manifest_line_for() {
    local want="$1" line
    while IFS= read -r line; do
        [ -n "$line" ] || continue
        if [ "${line%%|*}" = "$want" ]; then
            printf '%s\n' "$line"
            return 0
        fi
    done < <(read_entries)
    return 1
}

# Commit SHA currently vendored, read back from the generated UPSTREAM.md.
recorded_sha() {
    local file="$1/UPSTREAM.md"
    [ -f "$file" ] || return 0
    sed -n 's/^- Vendored commit: `\([0-9a-f]\{7,40\}\)`.*/\1/p' "$file" | head -1
}

# Many manifest entries share one upstream repo (a repo shipping N skills gets N
# lines). Everything below is keyed and cached per (url, ref) so a sync clones —
# and a check queries — each repo once per run, not once per skill.
repo_key() {
    printf '%s@%s' "$1" "$2" | tr -c 'A-Za-z0-9._@-' '_'
}

remote_sha() {
    local url="$1" ref="$2"
    local cache="$TMPROOT/lsremote/$(repo_key "$url" "$ref")"

    if [ ! -f "$cache" ]; then
        mkdir -p "$TMPROOT/lsremote"
        git ls-remote "$url" "refs/heads/$ref" "refs/tags/$ref" 2>/dev/null \
            | head -1 | cut -f1 > "$cache"
    fi
    cat "$cache"
}

# Echoes the path to a clone of (url, ref), cloning on first request.
# Returns 1 and echoes nothing if the clone failed (cached as a failure so a
# dead repo is not retried once per skill it ships).
ensure_clone() {
    local url="$1" ref="$2"
    local key dir
    key="$(repo_key "$url" "$ref")"
    dir="$TMPROOT/repos/$key"

    if [ -f "$dir.failed" ]; then
        return 1
    fi
    if [ -d "$dir" ]; then
        printf '%s\n' "$dir"
        return 0
    fi

    mkdir -p "$TMPROOT/repos"
    if git clone --depth 1 --branch "$ref" --quiet "$url" "$dir" 2>/dev/null; then
        printf '%s\n' "$dir"
        return 0
    fi
    rm -rf "$dir"
    : > "$dir.failed"
    return 1
}

# ----------------------------------------------------------------------------
#  Actions
# ----------------------------------------------------------------------------

list_sources() {
    echo -e "\n${BOLD}External skill sources${NC}"
    echo -e "${DIM}  public: $MANIFEST${NC}"
    if [ -f "$MANIFEST_LOCAL" ]; then
        echo -e "${DIM}  local:  $MANIFEST_LOCAL (gitignored)${NC}"
    fi
    echo ""

    local name url ref subpath scope sha tag
    while IFS='|' read -r name url ref subpath scope; do
        [ -n "${name:-}" ] || continue
        sha="$(recorded_sha "$(dest_for "$name" "$scope")")"
        tag=""
        [ "$scope" = "local" ] && tag=" ${YELLOW}[local]${NC}"
        echo -e "   ${CYAN}$name${NC}$tag"
        echo -e "     repo:     $url ${DIM}($ref)${NC}"
        echo -e "     subpath:  ${subpath}"
        if [ -n "$sha" ]; then
            echo -e "     vendored: ${sha:0:7}"
        else
            echo -e "     vendored: ${YELLOW}not synced yet${NC}"
        fi
        echo ""
    done < <(read_entries)
}

check_one() {
    local name="$1" url="$2" ref="$3" scope="$4"
    local local_sha remote tag=""

    [ "$scope" = "local" ] && tag=" ${DIM}[local]${NC}"
    local_sha="$(recorded_sha "$(dest_for "$name" "$scope")")"
    remote="$(remote_sha "$url" "$ref")"

    if [ -z "$remote" ]; then
        echo -e "   ${RED}?${NC} ${BOLD}$name${NC}$tag — could not reach $url ($ref)"
        return 1
    fi
    if [ -z "$local_sha" ]; then
        echo -e "   ${YELLOW}+${NC} ${BOLD}$name${NC}$tag — not vendored yet ${DIM}(upstream ${remote:0:7})${NC}"
        return 2
    fi
    if [ "$local_sha" = "$remote" ]; then
        echo -e "   ${GREEN}=${NC} ${BOLD}$name${NC}$tag — up to date ${DIM}(${local_sha:0:7})${NC}"
        return 0
    fi
    echo -e "   ${YELLOW}^${NC} ${BOLD}$name${NC}$tag — behind upstream ${DIM}(${local_sha:0:7} -> ${remote:0:7})${NC}"
    return 2
}

sync_one() {
    local name="$1" url="$2" ref="$3" subpath="$4" scope="$5"
    local dest before after tmp src staged prev_synced=""

    dest="$(dest_for "$name" "$scope")"
    before="$(recorded_sha "$dest")"
    if [ -f "$dest/UPSTREAM.md" ]; then
        prev_synced="$(sed -n 's/^- Synced: //p' "$dest/UPSTREAM.md" | head -1)"
    fi

    tmp="$TMPROOT/staging/$name"
    rm -rf "$tmp"
    mkdir -p "$tmp"

    local repo cached="" tag=""
    [ -d "$TMPROOT/repos/$(repo_key "$url" "$ref")" ] && cached=" ${DIM}(cached clone)${NC}"
    [ "$scope" = "local" ] && tag=" ${YELLOW}[local]${NC}"
    echo -e "\n${BLUE}[$name]${NC}$tag $url ${DIM}($ref)${NC}$cached"

    if ! repo="$(ensure_clone "$url" "$ref")"; then
        echo -e "   ${RED}FAIL${NC} clone failed — leaving the existing copy untouched"
        return 1
    fi

    after="$(git -C "$repo" rev-parse HEAD)"
    local commit_date
    commit_date="$(git -C "$repo" log -1 --format='%cI')"

    src="$repo/$subpath"
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
            if [ -f "$repo/$candidate" ]; then
                cp "$repo/$candidate" "$staged/LICENSE"
                break
            fi
        done
    fi
    if [ ! -f "$staged/LICENSE" ] && [ "$scope" != "local" ]; then
        echo -e "   ${YELLOW}WARN${NC} upstream ships no LICENSE — you are publishing content with no grant of rights"
        echo -e "        Move this entry to $MANIFEST_LOCAL to keep it private instead."
    fi

    # Re-syncing an unchanged commit keeps the original timestamp, so an
    # idempotent sync leaves no diff to review.
    local synced
    if [ "$before" = "$after" ] && [ -n "$prev_synced" ]; then
        synced="$prev_synced"
    else
        synced="$(date -u '+%Y-%m-%dT%H:%M:%SZ')"
    fi

    write_upstream_md "$staged/UPSTREAM.md" "$name" "$url" "$ref" "$after" "$commit_date" "$subpath" "$synced" "$scope"

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
    local file="$1" name="$2" url="$3" ref="$4" sha="$5" commit_date="$6" subpath="$7" synced="$8" scope="$9"
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
- Scope: $scope
EOF

    if [ "$scope" = "local" ]; then
        cat >> "$file" <<EOF

## Private copy — not redistributed

This skill is tracked in \`external/sources.local.txt\` and vendored under
\`external/.local/\`, which is gitignored. It is here for local use only,
because upstream ships no license or one this repo cannot redistribute under.
Do not commit it or copy it into \`external/\`.
EOF
    fi

    cat >> "$file" <<EOF

## Do not edit by hand

Local changes are overwritten on the next sync. To pull upstream changes:

\`\`\`bash
./scripts/sync-external.sh $name
\`\`\`

If you need behaviour that differs from upstream, either open a PR upstream or
fork the repo and point the manifest at your fork.

License: see \`LICENSE\` in this directory if present (the upstream project's
terms apply to this copy).
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

validate_manifest

if [ "$MODE" = "list" ]; then
    list_sources
    exit 0
fi

# Resolve which manifest entries to act on.
ENTRIES=()
if [ ${#TARGETS[@]} -gt 0 ]; then
    for t in "${TARGETS[@]}"; do
        entry="$(manifest_line_for "$t")" || die "no such source in either manifest: $t (try --list)"
        ENTRIES+=("$entry")
    done
else
    while IFS= read -r line; do
        [ -n "$line" ] && ENTRIES+=("$line")
    done < <(read_entries)
fi

[ ${#ENTRIES[@]} -gt 0 ] || die "manifests have no entries"

if [ "$MODE" = "check" ]; then
    echo -e "\n${BOLD}Checking external skills against upstream${NC}\n"
    stale=0
    for entry in "${ENTRIES[@]}"; do
        IFS='|' read -r name url ref subpath scope <<< "$entry"
        check_one "$name" "$url" "$ref" "$scope" || stale=1
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
    IFS='|' read -r name url ref subpath scope <<< "$entry"
    sync_one "$name" "$url" "$ref" "$subpath" "$scope" || FAILED=$((FAILED + 1))
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
