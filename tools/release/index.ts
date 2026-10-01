/* eslint-disable no-console -- CLI tool, console output is the interface */
import type { FlagSpec } from '../cli/flags';
import { parseArgs } from '../cli/flags';
import { alphaCommand } from './commands/alpha';
import { checkPrCommand } from './commands/check-pr';
import { checkTagCommand } from './commands/check-tag';
import { labelCommand } from './commands/label';
import { notesCommand } from './commands/notes';
import { prepareCommand } from './commands/prepare';

const USAGE = `Usage: pnpm release <subcommand> [args]

  prepare <vX.Y.Z>    cut release/vX.Y.Z (from main, or from vX.Y.Z-1 for a patch), pick the "backport" PRs
                      onto it and create the draft pre-release
  alpha <tag>         pick the "backport" PRs onto release/vX.Y.Z, tag its head as the alpha, re-point the
                      pre-release to it and watch its CI run
  check-pr <number>   check a PR's body against docs/PULL_REQUEST_TEMPLATE.md and its category labels
  check-tag <tag>     check that a tag ships no "upcoming" ENV docs and no PR another release shipped
  label <tag>         label the PRs a tag shipped and their issues, or remove a label everywhere
  notes <tag>         print the release notes of a tag`;

type Command = (args: ReadonlyArray<string>) => number;

const COMMANDS: ReadonlyMap<string, Command> = new Map<string, Command>([
  [ 'prepare', prepareCommand ],
  [ 'alpha', alphaCommand ],
  [ 'check-pr', checkPrCommand ],
  [ 'check-tag', checkTagCommand ],
  [ 'label', labelCommand ],
  [ 'notes', notesCommand ],
]);

interface Options {
  help: boolean;
}

const showHelp: FlagSpec<Options> = { kind: 'switch', apply: (options) => {
  options.help = true;
} };

// Only the global flags live here; everything after the subcommand is passed through for the subcommand
// to parse, so each one owns its own flag surface.
const FLAGS: ReadonlyMap<string, FlagSpec<Options>> = new Map([
  [ '--help', showHelp ],
  [ '-h', showHelp ],
]);

function main(argv: ReadonlyArray<string>): number {
  const { options, rest } = parseArgs(argv, FLAGS, { help: false }, { kind: 'passthrough' });
  const [ name, ...args ] = rest;

  if (options.help) {
    console.log(USAGE);
    return 0;
  }

  const command = name === undefined ? undefined : COMMANDS.get(name);
  if (command === undefined) {
    console.error(name === undefined ? USAGE : `Unknown subcommand: ${ name }\n${ USAGE }`);
    return 1;
  }

  return command(args);
}

try {
  process.exitCode = main(process.argv.slice(2));
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
}
