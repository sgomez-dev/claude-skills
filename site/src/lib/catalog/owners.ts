/**
 * Upstream owners that are organisations or companies, not individuals: schema.org `Organization` instead of `Person`.
 * An explicit list (GitHub's API is not called at build time). Everyone not listed stays a `Person`; add an owner here
 * when `external/sources.txt` gains an org-owned upstream.
 */
export const ORG_OWNERS: ReadonlySet<string> = new Set([
  'vercel-labs', 'heygen-com', 'greensock', 'higgsfield-ai', 'browser-use', 'digitalsamba', 'nextlevelbuilder',
]);

export const isOrgOwner = (owner: string): boolean => ORG_OWNERS.has(owner.toLowerCase());
