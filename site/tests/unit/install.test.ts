import { describe, expect, it } from 'vitest';
import { installOptions } from '@/lib/install';
import type { CommandSkill, ExternalSkill } from '@/lib/catalog/types';

describe('installOptions', () => {
  it('offers script installs first and the plugin bundle last for commands', () => {
    const opts = installOptions({ kind: 'command', bundle: 'legal-skills' } as CommandSkill);
    expect(opts.map((o) => o.id)).toEqual(['script-unix', 'script-windows', 'plugin']);
    expect(opts[0]!.command).toBe('curl -fsSL https://raw.githubusercontent.com/sgomez-dev/claude-skills/main/install.sh | bash');
    expect(opts[1]!.command).toBe('irm https://raw.githubusercontent.com/sgomez-dev/claude-skills/main/install.ps1 | iex');
    expect(opts[2]).toEqual({
      id: 'plugin',
      bundle: 'legal-skills',
      command: '/plugin marketplace add sgomez-dev/claude-skills\n/plugin install legal-skills@claude-skills-collection',
    });
  });
  it('has no plugin option for externals or bundle-less commands', () => {
    expect(installOptions({ kind: 'external' } as ExternalSkill).map((o) => o.id)).toEqual(['script-unix', 'script-windows']);
    expect(installOptions({ kind: 'command', bundle: null } as CommandSkill).map((o) => o.id)).toEqual(['script-unix', 'script-windows']);
  });
  it('generic set for the home page', () => {
    expect(installOptions(null).map((o) => o.id)).toEqual(['script-unix', 'script-windows']);
  });
});
