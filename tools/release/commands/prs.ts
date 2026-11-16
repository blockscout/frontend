/* eslint-disable no-console -- CLI subcommand, console output is the interface */
import type { FlagSpec } from '../../cli/flags';
import { parseArgs } from '../../cli/flags';
import { listTags } from '../git';
import { nestedEnvChanges } from '../notes-sections';
import type { ReleasePullRequest } from '../release-prs';
import { rangePrs } from '../release-prs';
import { RELEASE_SOURCE } from '../release-source';
import { parseAlphaTagOrThrow, parseTagOrThrow, previousAlphaTag, releaseBranch, versionLabel } from '../versions';
import { describePr, logExclusions, logList } from './report';

const USAGE = `Usage: pnpm release prs <vX.Y.Z-alpha.N> [--since <tag>]

  prints the PRs the alpha adds to --since, by default the previous alpha of its release, one per line with
  its "Environment variables" section nested under it, and nothing for the first alpha; an alpha not tagged
  yet is read up to its release branch`;

export interface PrsArgs {
  readonly tag: string;
  readonly since: string | undefined;
}

interface Options {
  since: string | undefined;
}

const FLAGS: ReadonlyMap<string, FlagSpec<Options>> = new Map<string, FlagSpec<Options>>([
  [ '--since', { kind: 'value', apply: (options, value) => {
    options.since = value;
  } } ],
]);

export function parsePrsArgs(args: ReadonlyArray<string>): PrsArgs {
  const { options, rest } = parseArgs<Options>(args, FLAGS, { since: undefined }, { kind: 'reject', usage: USAGE });
  if (rest.length !== 1) {
    throw new Error(USAGE);
  }
  const [ tag ] = rest;
  parseAlphaTagOrThrow(tag);
  if (options.since !== undefined) {
    parseTagOrThrow(options.since);
  }
  return { tag, since: options.since };
}

export interface PrsRange {
  readonly from: string;
  readonly to: string;
}

// An alpha not tagged yet is where the alpha phase leaves its picks before tagging: the release branch.
export function prsRange({ tag, since }: PrsArgs, tags: ReadonlyArray<string>): PrsRange | undefined {
  const from = since ?? previousAlphaTag(tag, tags);
  if (from === undefined) {
    return undefined;
  }
  return { from, to: tags.includes(tag) ? tag : releaseBranch(parseAlphaTagOrThrow(tag)) };
}

export function prList(prs: ReadonlyArray<ReleasePullRequest>): string {
  return prs
    .flatMap(({ number, title, url, body }) => [ `- #${ number } ${ title } ${ url }`, ...nestedEnvChanges(body) ])
    .join('\n');
}

export function prsCommand(args: ReadonlyArray<string>): number {
  const prsArgs = parsePrsArgs(args);
  const { tag } = prsArgs;
  const range = prsRange(prsArgs, listTags());
  if (range === undefined) {
    console.error(`No alpha of ${ versionLabel(tag) } precedes ${ tag }; nothing to compare it with`);
    return 0;
  }

  console.error(`${ tag } compared with ${ range.from }${ range.to === tag ? '' : `, not tagged yet, so read up to ${ range.to }` }`);
  const { prs, skipped, unresolved } = rangePrs(tag, range.from, range.to, RELEASE_SOURCE);
  logList('PRs in the list', prs.map(describePr));
  logExclusions(skipped, unresolved);

  if (prs.length > 0) {
    console.log(prList(prs));
  }
  return 0;
}
