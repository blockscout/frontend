/* eslint-disable no-console -- CLI tool, console output is the interface */
import type { FlagSpec } from '../cli/flags';
import { parseArgs } from '../cli/flags';
import { checkPrCommand } from './commands/check-pr';
import { labelCommand } from './commands/label';
import { notesCommand } from './commands/notes';

const USAGE = `Usage: pnpm release <subcommand> [args]

  check-pr <number>   check a PR's body against docs/PULL_REQUEST_TEMPLATE.md and its category labels
  label <tag>         label the PRs a tag shipped and their issues, or remove a label everywhere
  notes <tag>         print the release notes of a tag`;

type Command = (args: ReadonlyArray<string>) => number;

const COMMANDS: ReadonlyMap<string, Command> = new Map<string, Command>([
  [ 'check-pr', checkPrCommand ],
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
