import fs from 'node:fs';
import path from 'node:path';
import { readPrivateNames } from '../src/lib/catalog/guard';

const siteRoot = path.resolve(import.meta.dirname, '..');
const names = readPrivateNames(path.resolve(siteRoot, '..'));
const roots = ['.open-next', 'public'].map((d) => path.join(siteRoot, d)).filter(fs.existsSync);
const patterns = names.map((n) => ({ n, re: new RegExp(`/s/${n}(?![a-z0-9-])|"s":"${n}"|\\[/${n}\\]`) }));

function* files(dir: string): Generator<string> {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) yield* files(p);
    else if (/\.(html|json|md|txt|xml|js|rsc|body)$/.test(e.name)) yield p;
  }
}

const hits: string[] = [];
for (const root of roots) {
  for (const f of files(root)) {
    const text = fs.readFileSync(f, 'utf8');
    for (const { n, re } of patterns) if (re.test(text)) hits.push(`${n} in ${path.relative(siteRoot, f)}`);
  }
}
console.log(`private names checked: ${names.length}; hits: ${hits.length}`);
for (const h of hits) console.error(`LEAK ${h}`);
process.exit(hits.length ? 1 : 0);
