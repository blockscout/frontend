/* eslint-disable no-console -- CLI subcommand, console output is the interface */
import fs from 'node:fs';
import path from 'node:path';

import type { FlagSpec } from '../../cli/flags';
import { parseArgs } from '../../cli/flags';
import { repoRoot } from '../git';
import { releaseNotes } from '../notes';
import { RELEASE_SOURCE } from '../release-source';
import { parseTagOrThrow } from '../versions';
import { logReleaseNotes } from './report';

const USAGE = `Usage: pnpm release notes <tag> [--out <file>]

  prints the release notes of the tag, or writes them to --out`;

const TEMPLATE_PATH = 'tools/release/notes-template.md';

export function readNotesTemplate(): string {
  return fs.readFileSync(path.join(repoRoot(), TEMPLATE_PATH), 'utf8');
}

export interface NotesArgs {
  readonly tag: string;
  readonly out: string | undefined;
}

interface Options {
  out: string | undefined;
}

const FLAGS: ReadonlyMap<string, FlagSpec<Options>> = new Map<string, FlagSpec<Options>>([
  [ '--out', { kind: 'value', apply: (options, value) => {
    options.out = value;
  } } ],
]);

export function parseNotesArgs(args: ReadonlyArray<string>): NotesArgs {
  const { options, rest } = parseArgs<Options>(args, FLAGS, { out: undefined }, { kind: 'reject', usage: USAGE });
  if (rest.length !== 1) {
    throw new Error(USAGE);
  }
  const [ tag ] = rest;
  parseTagOrThrow(tag);
  return { tag, out: options.out };
}

export function notesCommand(args: ReadonlyArray<string>): number {
  const { tag, out } = parseNotesArgs(args);
  const notes = releaseNotes(tag, RELEASE_SOURCE, readNotesTemplate());
  logReleaseNotes(tag, notes);

  if (out === undefined) {
    console.log(notes.markdown);
  } else {
    fs.writeFileSync(out, notes.markdown);
    console.error(`\nNotes written to ${ path.resolve(out) }.`);
  }
  return 0;
}
