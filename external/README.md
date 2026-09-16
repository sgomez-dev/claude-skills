# External Agent Skills

Third-party skills vendored from their upstream git repos. Everything in here is
**someone else's work**, copied in verbatim and kept in sync with a script — not
authored in this repo.

## Why they live outside `skills/`

The 326 skills in `skills/` are **slash commands**: a single `.md` file with a
`description` in frontmatter and a `$ARGUMENTS` placeholder, installed to
`~/.claude/commands/category--name.md` and invoked as `/category--name`.

The skills in here are **Agent Skills**: a *directory* containing `SKILL.md`
plus optional `references/` and `workflows/` subdirectories, installed to
`~/.claude/skills/<name>/`. Claude Code loads `SKILL.md` and pulls in the
reference files on demand (progressive disclosure), so flattening one into a
single command file would break it.

Two formats, two install targets, two directories:

| | `skills/` | `external/` |
|---|---|---|
| Format | one `.md` per skill | directory with `SKILL.md` |
| Installs to | `~/.claude/commands/` | `~/.claude/skills/` |
| Invoked as | `/category--name` | `/name`, or auto-triggered by description |
| Authored | here | upstream |
| Validated by | `scripts/test-runner.sh` | upstream's own CI |

## Currently vendored

107 skills from 13 upstream repos, ~34 MB. Grouped by source:

| Upstream | License | Skills |
|----------|---------|--------|
| [kylezantos/design-motion-principles](https://github.com/kylezantos/design-motion-principles) | MIT | `design-motion-principles` |
| [emilkowalski/skills](https://github.com/emilkowalski/skills) | MIT | `animate` `animate-expo` `animation-vocabulary` `apple-design` `ask-sonner` `emil-design-eng` `find-animation-opportunities` `improve-animations` `pick-ui-library` `prototype` `review-animations` `write-swift` |
| [Leonxlnx/taste-skill](https://github.com/Leonxlnx/taste-skill) | MIT | `brandkit` `brutalist-skill` `gpt-tasteskill` `image-to-code-skill` `imagegen-frontend-mobile` `imagegen-frontend-web` `minimalist-skill` `output-skill` `redesign-skill` `soft-skill` `stitch-skill` `taste-skill` |
| [nextlevelbuilder/ui-ux-pro-max-skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) | MIT | `banner-design` `brand` `design` `design-system` `slides` `ui-styling` `ui-ux-pro-max` |
| [pbakaus/impeccable](https://github.com/pbakaus/impeccable) | Apache-2.0 | `impeccable` |
| [AgriciDaniel/banana-claude](https://github.com/AgriciDaniel/banana-claude) | MIT | `banana` |
| [vercel-labs/agent-browser](https://github.com/vercel-labs/agent-browser) | Apache-2.0 | `agent-browser` |
| [Panniantong/Agent-Reach](https://github.com/Panniantong/Agent-Reach) | MIT | `agent-reach` |
| [higgsfield-ai/skills](https://github.com/higgsfield-ai/skills) | MIT | `higgsfield-brandkit` `higgsfield-generate` `higgsfield-marketplace-cards` `higgsfield-product-photoshoot` `higgsfield-soul-id` `higgsfield-video-explainer` `higgsfield-websites` `higgsfield-youtube-thumbnail` |
| [AgriciDaniel/claude-ads](https://github.com/AgriciDaniel/claude-ads) | MIT | `ads` plus 33 `ads-*` — `ads-google` `ads-meta` `ads-tiktok` `ads-linkedin` `ads-amazon` `ads-apple` `ads-microsoft` `ads-reddit` `ads-pinterest` `ads-snapchat` `ads-x` `ads-youtube` `ads-attribution` `ads-audit` `ads-budget` `ads-competitor` `ads-create` `ads-creative` `ads-dna` `ads-generate` `ads-landing` `ads-launch` `ads-math` `ads-monitor` `ads-optimize` `ads-photoshoot` `ads-plan` `ads-report` `ads-research` `ads-server-side-tracking` `ads-setup` `ads-test` `ads-validate` |
| [Jakeschincariol/instagram-agent-skill](https://github.com/Jakeschincariol/instagram-agent-skill) | MIT | `ig-audit` `ig-caption` `ig-carousel` `ig-comment` `ig-dm` `ig-human` `ig-plan` `ig-profile` `ig-reel` `ig-reply` `ig-repurpose` `ig-story` `ig-viral` |
| [heygen-com/hyperframes](https://github.com/heygen-com/hyperframes) | Apache-2.0 | `hyperframes` `hyperframes-animation` `hyperframes-audio` `hyperframes-cli` `hyperframes-core` `hyperframes-creative` `hyperframes-keyframes` `hyperframes-registry` `embedded-captions` `faceless-explainer` `figma` `general-video` `media-use` `motion-graphics` `music-to-video` |
| [oso95/scroll-world](https://github.com/oso95/scroll-world) | MIT | `scroll-world` |

Each directory carries an `UPSTREAM.md` recording the exact vendored commit, and
the upstream `LICENSE`.

### Skills that need something installed

Vendoring the prompt does not install the tool it drives. These need setup before
they do anything useful:

| Skill | Needs |
|-------|-------|
| `impeccable` | Node — ships a packaged CLI (`scripts/impeccable`, `scripts/impeccable.cmd`) plus browser helpers. Talks to `https://impeccable.style/api`, overridable via `IMPECCABLE_API_URL` |
| `agent-browser` | The `agent-browser` npm CLI — the skill is a thin front end for it |
| `agent-reach` | Its Python package installed separately |
| `banana` | A Gemini API key; ships Python scripts |
| `ui-ux-pro-max`, `ui-styling`, `design`, `design-system` | Python for their helper scripts; ship large data assets (Google Fonts CSV, Phosphor icon JSON) |
| `higgsfield-*` (all 8) | The `higgsfield` CLI and a Higgsfield account. **Each one instructs a `curl … \| sh` install** of `higgsfield-ai/cli` — first-party and gated on "install it only after permission", but it is the pattern this repo's safety lint forbids inside `skills/`, and `external/` is not scanned. Install the CLI yourself if you would rather not have a skill do it |
| `ads`, `ads-*` (34) | Per-platform ad-account API credentials. `ads-research` references the repo-root `claude_ads_core` Python package, which does not travel with a per-skill vendored subpath — clone upstream separately if you need that one at full strength |
| `ig-*` (13) | Python helpers; Instagram/Meta credentials for anything that touches a real account |
| `media-use` | The `heygen` CLI (`node scripts/resolve.mjs --doctor` verifies it). Earlier OpenMontage copies of this skill shipped a `curl … \| bash` install; this upstream does not |
| `hyperframes*`, `embedded-captions`, `music-to-video` | Node and the hyperframes toolchain; ffmpeg for the video paths |

### Names are upstream's, not ours

Installed names match upstream exactly, so `animate` installs as `/animate` and
`design-system` as `/design-system` — generic, and they will sit next to your own
`/web--design-system` slash command without colliding (different namespaces:
`~/.claude/skills/` vs `~/.claude/commands/`).

Two names were changed, both for cause:

- `agent-reach` — upstream's directory is literally `skill`, which would install as `/skill`.
- The private `seedance-*` entries — upstream numbers its directories (`01-cinematic` … `15-real-estate`), which would install as `/01-cinematic`. Each of those `SKILL.md` files already declares `name: seedance-…` in its frontmatter, so the directory is renamed to match what upstream itself calls the skill.
- Nothing else. Renaming diverges from upstream's own docs, so it needs a reason.

`sync-external.sh` refuses a manifest with duplicate names rather than letting a
later entry silently overwrite an earlier one.

## Two manifests: published and private

Some skills are worth using but not ours to republish — upstream ships no
LICENSE (no grant of rights at all), or a copyleft license incompatible with
this repo's MIT. Private use is not distribution, so those are tracked
separately:

| | `sources.txt` | `sources.local.txt` |
|---|---|---|
| Vendors into | `external/<name>/` | `external/.local/<name>/` |
| In git | yes, published | **no** — both the manifest and the tree are gitignored |
| Installs to | `~/.claude/skills/<name>/` | same |
| Remote `curl \| bash` install | included | not visible (never leaves this machine) |
| CI validation | enforced | not applicable |

Both are synced by the same command and installed by the same installer; the
only difference is what gets committed. `sync-external.sh` marks private entries
`[local]` in its output and writes a "not redistributed" note into their
`UPSTREAM.md`.

Because `sources.local.txt` is gitignored it exists only on the machine that
created it — **keep your own backup** if the selection matters to you.

Sources tracked privately so far — 73 skills from 5 repos:

| Upstream | Why private | Skills |
|----------|-------------|--------|
| `vercel-labs/agent-skills` | no LICENSE | 9 — react/next, UI and prose review |
| `AccessLint/skills` | no LICENSE | 5 — WCAG 2.2 audit tiers |
| `bencium/bencium-marketplace` | no LICENSE | 16 — UX lenses, EU AI Act, AEO |
| `calesthio/OpenMontage` | AGPL-3.0 | 25 of ~88 — Three.js, Remotion, Motion, video, dataviz |
| `AKCodez/higgsfield-claude-skills` | no LICENSE | 18 of 19 — Seedance/Higgsfield UGC ad pipeline, driven through Playwright browser automation |

Because the manifest is gitignored, **each machine holds whatever its own
`sources.local.txt` lists** — a fresh clone starts with none of them, and a
clone that wrote only part of this table has only that part. The table records
what has been selected, not what any given checkout currently has on disk; run
`./scripts/sync-external.sh --list` to see the truth for this machine.

**Moving an entry from `sources.local.txt` to `sources.txt` publishes it.** Only
do that once upstream has a license that permits it.

## Updating

Upstream repos keep moving, so vendored copies go stale. The sync script pulls
them forward:

```bash
# Which sources are behind upstream? (network only, changes nothing)
./scripts/sync-external.sh --check

# Pull everything forward
./scripts/sync-external.sh

# Pull one source forward
./scripts/sync-external.sh design-motion-principles

# What's in the manifest, and at which commit
./scripts/sync-external.sh --list
```

On **Windows**, `heygen-com/hyperframes` contains paths longer than the 260-char
default limit, and the clone inside the sync fails before it can vendor anything.
Enable long paths for that one run without touching your global git config:

```bash
GIT_CONFIG_COUNT=1 GIT_CONFIG_KEY_0=core.longpaths GIT_CONFIG_VALUE_0=true ./scripts/sync-external.sh
```

Then review and commit like any other change:

```bash
git diff external/
git add external/ && git commit -m "chore(external): sync design-motion-principles"
```

Re-run `./install.sh` afterwards to push the update into `~/.claude/skills/`.

You don't have to remember to check: `.github/workflows/external-skills.yml`
runs `--check` every Monday and opens one tracking issue when a source has moved.
It also validates on every PR that `sources.txt` and the vendored directories
still agree (no undeclared directories, no missing `SKILL.md`/`UPSTREAM.md`).

## Adding another external skill

1. Add a line to [`sources.txt`](sources.txt):

   ```
   name|repo-url|ref|subpath
   ```

   `subpath` is the path inside the repo to the directory holding `SKILL.md`
   (`.` if it's at the repo root). One line per skill — if a repo ships several,
   add several lines pointing at each skill directory.

2. Sync it:

   ```bash
   ./scripts/sync-external.sh name
   ```

3. **Check the license first.** No `LICENSE` upstream, or an (A)GPL one? It goes
   in `sources.local.txt`, not `sources.txt`. The sync warns and CI fails if a
   published entry has no license.

4. Read what you just vendored. This is third-party prompt content that will run
   with your permissions — skim `SKILL.md` and anything under `workflows/` for
   shell commands, network calls, or instructions you don't want. Check for
   shipped executables too: `find external/<name> -name '*.mjs' -o -name '*.py'`.

5. Commit the vendored copy, and add a row to the table above.

## Rules

- **Never hand-edit a vendored directory.** The next sync overwrites it. If you
  need different behaviour, PR it upstream or fork the repo and point
  `sources.txt` at your fork.
- **Keep the upstream `LICENSE`.** The sync script copies it automatically;
  don't remove it.
- **One manifest line = one skill directory.** The sync script refuses a subpath
  with no `SKILL.md` in it.

## Why vendored instead of a git submodule

`install.sh` clones this repo with `--depth 1` (no `--recurse-submodules`), and
the plugin marketplace in `.claude-plugin/marketplace.json` reads subdirectories
straight from the GitHub tree — neither sees submodule contents. Vendoring keeps
`curl | bash` installs, marketplace bundles, and offline clones all working,
with `sync-external.sh` providing the update path a submodule would have given.
