import type { FlagSpec } from '../../cli/flags';
import { parseArgs } from '../../cli/flags';

export interface PhaseArgs {
  readonly target: string;
  readonly dryRun: boolean;
}

interface Options {
  dryRun: boolean;
}

const FLAGS: ReadonlyMap<string, FlagSpec<Options>> = new Map<string, FlagSpec<Options>>([
  [ '--dry-run', { kind: 'switch', apply: (options) => {
    options.dryRun = true;
  } } ],
]);

export function parsePhaseArgs(args: ReadonlyArray<string>, usage: string): PhaseArgs {
  const { options, rest } = parseArgs<Options>(args, FLAGS, { dryRun: false }, { kind: 'reject', usage });
  if (rest.length !== 1) {
    throw new Error(usage);
  }
  return { target: rest[0], dryRun: options.dryRun };
}
