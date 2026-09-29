export const SITE_URL = 'https://skills.sgomez.dev';
export const REPO_URL = 'https://github.com/sgomez-dev/claude-skills';
export const RAW_URL = 'https://raw.githubusercontent.com/sgomez-dev/claude-skills/main';
export const AUTHOR = {
  name: 'Santiago Gómez de la Torre',
  url: 'https://sgomez.dev',
  /**
   * Profiles that identify the author (schema.org `Person.sameAs`, humans.txt). Adding one is a one-line change:
   * append its URL. Never put a source-code or skill URL here: `sameAs` is for identity.
   */
  sameAs: [
    'https://sgomez.dev',
    'https://github.com/sgomez-dev',
    'https://www.linkedin.com/in/sgomez-dev/',
    'https://www.instagram.com/santigt1503/',
  ],
} as const;
