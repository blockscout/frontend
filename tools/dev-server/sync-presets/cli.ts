import fs from 'fs';
import path from 'path';

import type { PresetTarget } from './sync';
import { TARGETS, parseAliases, syncTarget } from './sync';

export const DRIFT_MESSAGE =
  '\nPreset dropdowns are out of sync with tools/dev-server/registry.json. Run `pnpm presets:sync`.';

export interface CliPaths {
  readonly root: string;
  readonly registryPath: string;
}

export interface OutputLine {
  readonly stream: 'out' | 'err';
  readonly text: string;
}

export interface CliResult {
  readonly output: ReadonlyArray<OutputLine>;
  readonly exitCode: number;
}

function formatOutcome(target: PresetTarget, changed: boolean, write: boolean): OutputLine {
  if (write) {
    return { stream: 'out', text: `${ changed ? '✏️  updated ' : '✓ ok      ' } ${ target.file }` };
  }
  if (changed) {
    return { stream: 'err', text: `✗ out of sync: ${ target.file }` };
  }
  return { stream: 'out', text: `✓ ${ target.file }` };
}

export function runSync(paths: CliPaths, write: boolean): CliResult {
  const aliases = parseAliases(fs.readFileSync(paths.registryPath, 'utf8'));
  const output: Array<OutputLine> = [];
  let drift = false;

  for (const target of TARGETS) {
    const absPath = path.join(paths.root, target.file);
    const { next, changed } = syncTarget(target, fs.readFileSync(absPath, 'utf8'), aliases);

    if (write && changed) {
      fs.writeFileSync(absPath, next);
    }
    if (!write && changed) {
      drift = true;
    }

    output.push(formatOutcome(target, changed, write));
  }

  if (drift) {
    output.push({ stream: 'err', text: DRIFT_MESSAGE });
    return { output, exitCode: 1 };
  }

  return { output, exitCode: 0 };
}
