# External Agent Skills

Third-party skills vendored from their upstream git repos. Everything in here is
**someone else's work**, copied in verbatim and kept in sync with a script — not
authored in this repo.

## Why they live outside `skills/`

The 325 skills in `skills/` are **slash commands**: a single `.md` file with a
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

| Skill | Upstream | License |
|-------|----------|---------|
| [`design-motion-principles`](design-motion-principles/) | [kylezantos/design-motion-principles](https://github.com/kylezantos/design-motion-principles) | MIT |

Each directory carries an `UPSTREAM.md` recording the exact vendored commit, and
the upstream `LICENSE`.

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

3. Read what you just vendored. This is third-party prompt content that will run
   with your permissions — skim `SKILL.md` and anything under `workflows/` for
   shell commands, network calls, or instructions you don't want.

4. Commit the vendored copy, and add a row to the table above.

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
