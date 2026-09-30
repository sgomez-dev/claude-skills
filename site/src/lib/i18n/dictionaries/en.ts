import { SECTIONS } from '@/content/sections';
import type { Figures } from '@/lib/catalog/figures';
import { fmtDay, fmtMonth } from '../format';

const licenseList = (f: Figures) => f.licenses.map((l) => `${l.count} ${l.id}`).join(', ');
const licenseNames = (f: Figures) => f.licenses.map((l) => l.id).join(', ');

export const en = {
  locale: 'en-GB',
  meta: {
    siteName: 'Claude Skills',
    title: (n: number) => `Claude Skills: ${n} free skills for Claude Code`,
    description: (n: number, commands: number) =>
      `${n} free, open-source skills for Claude Code: video, web design, sales, legal, finance, AI and code. The ${commands} built here declare their permissions.`,
  },
  nav: { label: 'Main', skipToContent: 'Skip to content', language: 'Language', github: 'GitHub', home: 'Home', credits: 'Credits', methodology: 'Methodology', breadcrumb: 'Breadcrumb' },
  masthead: { issue: (d: Date, n: number) => `Nº 01 · ${fmtMonth('en-GB', d)} · ${n} specialists` },
  home: {
    claim: { lead: 'Nobody knows', accent: 'everything.', highlight: 'Your agent,', tail: 'now it does.' },
    dek: (n: number) => `${n} specialists for Claude Code. Video, motion, brand, sales, legal and code: one command and done.`,
    inThisIssue: 'In this issue',
    coverLines: [
      { section: 'business', text: 'Contracts checked before you sign' },
      { section: 'sales', text: 'Prospecting that fills your calendar' },
      { section: 'web', text: 'Websites with craft' },
      { section: 'video', text: 'Videos that stop the scroll' },
    ],
    stickerFree: 'free & open source',
    stickerPlatforms: 'Claude Code · Cursor · Windsurf · Codex',
    index: 'Contents',
    stats: {
      skills: 'skills in this issue',
      permissionsLabel: 'commands declare what they can touch',
      platforms: 'agents supported',
      updated: 'last updated',
    },
    figures: {
      label: 'The catalog in numbers',
      line: (f: Figures) => `${f.total} skills · ${f.commands} built here (MIT) · ${f.external} from ${f.repos} community repositories (${licenseList(f)})`,
      updated: 'updated',
    },
    cta: {
      title: 'Install everything in 30 seconds',
      body: 'One line in your terminal copies every skill into Claude Code. Type / and they are there.',
      more: 'Every way to install',
    },
    faqTitle: 'Questions',
    faq: (f: Figures) => [
      { q: 'What is a skill?', a: 'A skill is a set of expert instructions that Claude Code loads when you need it. Type a command such as /legal--contract-review, or simply describe the task, and your agent works like a specialist.' },
      { q: 'Do I need to know how to code?', a: 'No. Many skills never touch code: contracts, sales emails, video edits, brand work. You need Claude Code installed; installing the skills takes one line.' },
      { q: 'How much does it cost?', a: `Free. The ${f.commands} skills built here are under the MIT license; the ${f.external} community skills keep their own upstream license (${licenseList(f)}). Claude Code itself needs a Claude subscription (Pro or higher) or an API key.` },
      { q: 'What can a skill touch on my computer?', a: 'Every command built here declares what it reads, what it writes, which commands it runs and whether it uses the network. You see it on each skill page before installing. Community skills follow their own upstream rules, so read their source first.' },
      { q: 'Does it work outside Claude Code?', a: 'Yes. The repository has guides for Cursor, Windsurf and Codex.' },
    ],
  },
  section: {
    skills: (n: number) => `${n} skills`,
    updated: (d: Date) => `Updated ${fmtDay('en-GB', d)}`,
    filters: {
      label: 'Filters', origin: 'Origin', all: 'All', command: 'Built here', external: 'Community',
      group: 'Category', allGroups: 'All categories', network: 'Uses the network',
    },
    showing: 'Showing {v} of {t}',
    empty: 'No skill matches these filters.',
  },
  skill: {
    titleSuffix: 'Claude Code skill',
    authorDescription: "Author's description",
    authorDescriptionTranslated: "Author's description (translated)",
    methodology: 'How we review this',
    pairsWith: 'Pairs well with',
    recipe: 'Recipe',
    useWhen: 'Use it when',
    notFor: 'Not for',
    output: 'What you get',
    faqTitle: 'Questions about this skill',
    answer: (slug: string, section: string) => `/${slug} is a Claude Code skill in the ${section} section.`,
    answerExternal: (owner: string, license: string) => ` It is maintained by ${owner} and published under the ${license} license.`,
    builtHere: 'Built here',
    copy: 'Copy',
    copied: 'Copied',
    by: (owner: string) => `By ${owner}`,
    updated: (d: Date) => `Updated ${fmtDay('en-GB', d)}`,
    howToAsk: 'How to ask for it',
    invoke: 'After installing with the script, type',
    install: 'Install',
    tabs: { 'script-unix': 'macOS · Linux', 'script-windows': 'Windows', plugin: 'Claude Code plugin' },
    pluginNote: 'Installs the whole {bundle} bundle.',
    otherAgents: 'Using Cursor, Windsurf or Codex?',
    otherAgentsLink: 'Platform guides',
    permissions: 'What it can touch',
    perm: {
      reads: 'Reads', writes: 'Writes', commands: 'Runs', network: 'Network', destructive: 'Destructive',
      nothing: 'Nothing', yes: 'Yes', no: 'No', more: (n: number) => `+${n} more`,
    },
    permissionsExternal: 'Community skills follow their upstream conventions and ship no permission manifest. Read the source before you run it.',
    provenance: 'Where it comes from',
    author: 'Author', license: 'License', source: 'Source', commit: 'Vendored commit', viewSource: 'View source',
    related: 'More from this section',
    demoSoon: 'Demo coming soon',
    notTranslated: 'Shown in English: the translation is on its way.',
  },
  credits: {
    title: 'Credits',
    dek: 'This issue is written by many hands. These are the upstream authors whose skills are vendored here, with their licenses.',
    builtHere: (n: number) => `${n} commands written in this repository by`,
    skills: (n: number) => `${n} skills`,
    license: 'License',
  },
  search: {
    open: 'Search skills',
    placeholder: (n: number) => `Search ${n} skills… try “contract” or “captions”`,
    noResults: 'Nothing found. Try another word.',
    hint: '↑↓ move · Enter open · Esc close',
    close: 'Close',
    results: 'Results',
    loading: 'Loading…',
    error: 'Search could not load. Close and reopen to retry.',
  },
  footer: { madeBy: 'Made by', license: 'Site and built-in skills: MIT', source: 'Source on GitHub', llms: 'For AI agents: llms.txt', credits: 'Credits', methodology: 'Methodology' },
  og: {
    home: (n: number) => `Claude Skills: ${n} free skills for Claude Code`,
    section: (name: string) => `${name}: Claude Code skills, Claude Skills`,
    skill: (name: string, section: string) => `${name}: Claude Code skill, ${section} section, Claude Skills`,
  },
  md: { web: 'Web version', install: 'Install', howToAsk: 'How to ask for it', permissions: 'Permissions', source: 'Source', section: 'Section', skills: 'Skills', license: 'License', author: 'Author' },
  date: (d: Date) => fmtDay('en-GB', d),
  // Written from the repository's real scripts and rules; reviewed and approved by Santiago on 2026-09-30.
  methodology: {
    title: 'How we choose and review skills',
    seoTitle: 'How we choose and review Claude Code skills: methodology',
    description: 'Who curates this catalog, what gets in, how permissions are declared and checked, how community skills are synced and which licenses we accept.',
    dek: 'This catalog is curated, not crawled. Here is what that means, and where the checks stop.',
    updated: 'Updated',
    reportLabel: 'Open an issue on GitHub',
    sections: (f: Figures): { h: string; p?: string[]; bullets?: string[] }[] => [
      { h: 'Who curates it', p: [`The catalog is curated by Santiago Gómez de la Torre, who also wrote the ${f.commands} skills built here. It is an independent project: it is not made by, or affiliated with, Anthropic.`] },
      { h: 'What is in it', p: [`${f.total} skills in ${SECTIONS.length} sections: ${f.commands} written in this repository and ${f.external} vendored from ${f.repos} community repositories. Every figure about the catalog is computed from the catalog when the site is built.`] },
      {
        h: 'What gets in',
        bullets: [
          "Built here: one task per skill, clear steps, and it detects the project's language and framework instead of assuming one.",
          `Community: only skills whose license lets us redistribute them with the original notices; currently ${licenseNames(f)}.`,
          'A skill whose upstream has no license, or an (A)GPL one, is used privately and never published on this site.',
        ],
      },
      {
        h: 'How permissions are declared and checked',
        p: [
          `Each of the ${f.commands} skills built here carries a permissions block in its frontmatter: what it reads, what it writes, which commands it runs, whether it uses the network and whether it can destroy data. The catalog build fails if a skill has no block, so a skill without one cannot appear here.`,
          'Two scripts run in CI on every change to a skill. One checks structure, the manifest, dangerous patterns (such as piping curl into a shell) and trigger quality. The other cross-checks the manifest against the text: a skill that mentions destructive or network commands must declare them. These are pattern-based checks. They catch mismatches, not intent, so read the source before you run anything you do not know.',
          'Community skills have no manifest. Their page says so and links to the source at the exact commit we vendored.',
        ],
      },
      {
        h: 'How community skills are synced',
        p: [
          'Community skills live in the repository under external/. A manifest (external/sources.txt) names each upstream repository, branch or tag and path, and a sync script (scripts/sync-external.sh) copies them in and pins the exact upstream commit. Each copy records that commit, its date and the upstream license in its own UPSTREAM.md and LICENSE files. A vendored copy is never edited by hand: the next sync would overwrite it. A weekly CI job reports which copies have fallen behind upstream.',
        ],
      },
      { h: 'Licenses', p: [`The ${f.commands} skills built here are MIT. The ${f.external} community skills keep their upstream license: ${licenseList(f)}. Every skill page shows its license and its original author.`] },
      {
        h: 'Dates and updates',
        p: [
          'The date on a skill is when its file last changed in git (built here) or the date of the vendored upstream commit (community). The date on the home page and on each section is the newest date among its skills, never the build time.',
          'Upstream drift is checked every week by CI. Updates are pulled in when the curator syncs them.',
        ],
      },
      { h: 'What this does not prove', p: ['Automated checks verify structure and declared permissions. They do not prove that a skill produces the right result for your case, and we do not review every line of every community skill. Treat a skill like any other code that runs on your machine.'] },
      { h: 'Report a problem', p: ['Found a wrong claim, a missing permission or a broken skill? Tell us on GitHub.'] },
    ],
  },
};

export type Dictionary = typeof en;
