/* eslint-disable no-console -- CLI tool, console output is the interface */
import type { AggregateResult } from './aggregate';
import { aggregate, biggestCommitIndex, loadProfile, printCommitList, printDelta, printTable } from './aggregate';

// CLI entry for the React DevTools profile aggregator. Everything worth a test lives in
// ./aggregate.ts; this file only parses arguments and calls the printers.
//
// See tools/profiling/CONTEXT.md for the full workflow.

const USAGE = 'Usage: pnpm profile:analyze <profile.json> [profileB.json] [--commit=N] [--commit-b=N] [--top=N] [--min-ms=N]';
const DEFAULT_TOP = 40;
const DEFAULT_MIN_MS = 15;

const args = process.argv.slice(2);
const files = args.filter((a) => !a.startsWith('--'));

function getOption(name: string, fallback: number): number {
  const raw = args.find((a) => a.startsWith(`--${ name }=`));
  return raw ? Number(raw.split('=')[1]) : fallback;
}

if (files.length < 1 || files.length > 2) {
  console.error(USAGE);
  process.exit(1);
}

const top = getOption('top', DEFAULT_TOP);
const minMs = getOption('min-ms', DEFAULT_MIN_MS);

// Loading comes first so any wire-format warning lands ahead of the file's commit list, the way it
// reads as a preamble to that file's numbers.
function analyze(file: string, commitOption: string, heading: string): AggregateResult {
  const profile = loadProfile(file);
  console.log(heading);
  printCommitList(profile.root, minMs);
  const result = aggregate(profile, getOption(commitOption, biggestCommitIndex(profile.root)));
  printTable(file, result, top);
  return result;
}

const resultA = analyze(files[0], 'commit', `Commits >= ${ minMs }ms in ${ files[0] }:`);

if (files[1]) {
  const resultB = analyze(files[1], 'commit-b', `\nCommits >= ${ minMs }ms in ${ files[1] }:`);
  printDelta(resultA, resultB, top);
}
