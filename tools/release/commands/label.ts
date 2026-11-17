/* eslint-disable no-console -- CLI subcommand, console output is the interface */
import type { FlagSpec } from '../../cli/flags';
import { parseArgs } from '../../cli/flags';
import { addLabel, BACKPORT_LABEL, ensureLabel, listLabeled, removeLabel } from '../github';
import type { ReleasePullRequest } from '../release-prs';
import { issuesToLabel, releasePrs } from '../release-prs';
import { RELEASE_SOURCE } from '../release-source';
import { isVersionLabel, parseTagOrThrow } from '../versions';
import { describePr, logExclusions, logList } from './report';

const USAGE = `Usage: pnpm release label <tag> --label <name> [--description <text>] [--color <hex>] [--dry-run]
       pnpm release label <tag> --remove <name> [--dry-run]

  --label    label the PRs the tag shipped and the issues they close; prints the issue numbers as JSON
  --remove   remove the label from every PR and issue that carries it`;

export type LabelAction =
  { readonly kind: 'apply'; readonly label: string; readonly description: string; readonly color: string } |
  { readonly kind: 'remove'; readonly label: string };

export interface LabelArgs {
  readonly tag: string;
  readonly action: LabelAction;
  readonly dryRun: boolean;
}

interface Options {
  label: string | undefined;
  remove: string | undefined;
  description: string;
  color: string;
  dryRun: boolean;
}

const DEFAULT_OPTIONS: Options = { label: undefined, remove: undefined, description: '', color: 'FFFFFF', dryRun: false };

const FLAGS: ReadonlyMap<string, FlagSpec<Options>> = new Map<string, FlagSpec<Options>>([
  [ '--label', { kind: 'value', apply: (options, value) => {
    options.label = value;
  } } ],
  [ '--remove', { kind: 'value', apply: (options, value) => {
    options.remove = value;
  } } ],
  [ '--description', { kind: 'value', apply: (options, value) => {
    options.description = value;
  } } ],
  [ '--color', { kind: 'value', apply: (options, value) => {
    options.color = value;
  } } ],
  [ '--dry-run', { kind: 'switch', apply: (options) => {
    options.dryRun = true;
  } } ],
]);

function toAction({ label, remove, description, color }: Options): LabelAction {
  if (label !== undefined && remove === undefined) {
    return { kind: 'apply', label, description, color };
  }
  if (remove !== undefined && label === undefined) {
    return { kind: 'remove', label: remove };
  }
  throw new Error(`Pass exactly one of --label and --remove\n${ USAGE }`);
}

export function parseLabelArgs(args: ReadonlyArray<string>): LabelArgs {
  const { options, rest } = parseArgs<Options>(args, FLAGS, { ...DEFAULT_OPTIONS }, { kind: 'reject', usage: USAGE });
  if (rest.length !== 1) {
    throw new Error(USAGE);
  }
  const [ tag ] = rest;
  parseTagOrThrow(tag);
  return { tag, action: toAction(options), dryRun: options.dryRun };
}

// The version label replaces `backport` on the PRs it ships; a PR that was never picked is not in `prs`
// and keeps it for the next release.
export function shippedBackports(prs: ReadonlyArray<ReleasePullRequest>, label: string): Array<number> {
  return isVersionLabel(label) ? prs.filter((pr) => pr.labels.includes(BACKPORT_LABEL)).map(({ number }) => number) : [];
}

function applyLabel(tag: string, action: Extract<LabelAction, { kind: 'apply' }>, dryRun: boolean): number {
  const { previousTag, prs, skipped, unresolved } = releasePrs(tag, RELEASE_SOURCE);
  const issues = issuesToLabel(prs, tag);
  const backports = shippedBackports(prs, action.label);

  console.error(`Release ${ tag }, compared with ${ previousTag }`);
  logList('PRs to label', prs.map(describePr));
  logExclusions(skipped, unresolved);
  logList('Issues to label', issues.map((number) => `#${ number }`));
  logList(`PRs to drop "${ BACKPORT_LABEL }" from`, backports.map((number) => `#${ number }`));

  if (dryRun) {
    console.error(`\nDry run: label "${ action.label }" not applied.`);
  } else {
    console.error(`\nLabel "${ action.label }" ${ ensureLabel(action.label, action.description, action.color) }.`);
    for (const number of [ ...prs.map((pr) => pr.number), ...issues ]) {
      addLabel(number, action.label);
    }
    for (const number of backports) {
      removeLabel(number, BACKPORT_LABEL);
    }
    console.error(`Labeled ${ prs.length } PRs and ${ issues.length } issues with "${ action.label }".`);
    console.error(`Dropped "${ BACKPORT_LABEL }" from ${ backports.length } PRs.`);
  }

  console.log(JSON.stringify(issues));
  return 0;
}

function removeLabelEverywhere(label: string, dryRun: boolean): number {
  const numbers = listLabeled(label);
  logList(`PRs and issues labeled "${ label }"`, numbers.map((number) => `#${ number }`));

  if (dryRun) {
    console.error(`\nDry run: label "${ label }" not removed.`);
    return 0;
  }
  for (const number of numbers) {
    removeLabel(number, label);
  }
  console.error(`Removed "${ label }" from ${ numbers.length } PRs and issues.`);
  return 0;
}

export function labelCommand(args: ReadonlyArray<string>): number {
  const { tag, action, dryRun } = parseLabelArgs(args);
  return action.kind === 'apply' ? applyLabel(tag, action, dryRun) : removeLabelEverywhere(action.label, dryRun);
}
