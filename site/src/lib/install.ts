import type { Skill } from '@/lib/catalog/types';
import { RAW_URL } from '@/lib/site';

export interface InstallOption {
  id: 'script-unix' | 'script-windows' | 'plugin';
  command: string;
  bundle?: string;
}

export function installOptions(skill: Skill | null): InstallOption[] {
  const options: InstallOption[] = [
    { id: 'script-unix', command: `curl -fsSL ${RAW_URL}/install.sh | bash` },
    { id: 'script-windows', command: `irm ${RAW_URL}/install.ps1 | iex` },
  ];
  if (skill?.kind === 'command' && skill.bundle) {
    options.push({
      id: 'plugin',
      bundle: skill.bundle,
      command: `/plugin marketplace add sgomez-dev/claude-skills\n/plugin install ${skill.bundle}@claude-skills-collection`,
    });
  }
  return options;
}
