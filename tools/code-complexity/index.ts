/* eslint-disable no-console -- this is a CLI whose entire job is to print a report to stdout */
import fs from 'fs';

import { computeFunctionComplexities } from './complexity';
import { DEFAULT_BASE_REF, DEFAULT_MAX_COMPLEXITY } from './config';
import { getChangedFiles, getChangedLineRanges, rangesOverlap, resolveBaseCommit } from './diff';
import type { ReportRow } from './report';
import { formatTable } from './report';
import { isInScope } from './scope';

interface CliOptions {
  baseRef: string;
  maxComplexity: number;
  focusPaths: Array<string>;
}

const USAGE = `Usage:
  test:code-complexity [--base <ref>] [--max-complexity <n>]   Gate functions touched by the diff.
  test:code-complexity <path...> [--max-complexity <n>]        Focused mode: score every function
                                                               in the given files, ignoring the diff.`;

function parseArgs(argv: ReadonlyArray<string>): CliOptions {
  const options: CliOptions = {
    baseRef: DEFAULT_BASE_REF,
    maxComplexity: DEFAULT_MAX_COMPLEXITY,
    focusPaths: [],
  };

  for (let index = 0; index < argv.length; index++) {
    const arg = argv[index];
    const readValue = (inline: string | undefined): string => {
      if (inline !== undefined) return inline;
      const next = argv[++index];
      if (next === undefined) throw new Error(`Missing value for ${ arg }`);
      return next;
    };

    if (arg === '--help' || arg === '-h') {
      console.log(USAGE);
      process.exit(0);
    } else if (arg.startsWith('--base')) {
      options.baseRef = readValue(arg.startsWith('--base=') ? arg.slice('--base='.length) : undefined);
    } else if (arg.startsWith('--max-complexity')) {
      const raw = readValue(arg.startsWith('--max-complexity=') ? arg.slice('--max-complexity='.length) : undefined);
      const value = Number(raw);
      if (!Number.isFinite(value) || value < 1) throw new Error(`Invalid --max-complexity: ${ raw }`);
      options.maxComplexity = value;
    } else if (arg.startsWith('-')) {
      throw new Error(`Unknown flag: ${ arg }\n${ USAGE }`);
    } else {
      options.focusPaths.push(arg);
    }
  }

  return options;
}

function normalizeDisplayPath(filePath: string): string {
  return filePath.replace(/\\/g, '/').replace(/^\.\//, '');
}

function readFile(filePath: string): string {
  return fs.readFileSync(filePath, 'utf8');
}

// Focused mode: score every function in the given files, no diff-scoping (spec FR11).
function runFocusedMode(options: CliOptions): Array<ReportRow> {
  const rows: Array<ReportRow> = [];
  for (const path of options.focusPaths) {
    const displayPath = normalizeDisplayPath(path);
    const functions = computeFunctionComplexities(readFile(path), displayPath);
    for (const fn of functions) {
      rows.push({
        file: displayPath,
        line: fn.startLine,
        name: fn.name,
        complexity: fn.complexity,
        isOffender: fn.complexity > options.maxComplexity,
      });
    }
  }
  return rows;
}

// Diff mode: gate only functions a changed line falls within, across in-scope changed files
// (spec FR5). Untouched functions in a changed file are listed but never flagged.
function runDiffMode(options: CliOptions): Array<ReportRow> {
  const baseCommit = resolveBaseCommit(options.baseRef);
  const changedFiles = getChangedFiles(baseCommit).filter(isInScope);

  const rows: Array<ReportRow> = [];
  for (const file of changedFiles) {
    if (!fs.existsSync(file)) continue; // deleted on the new side
    const changedRanges = getChangedLineRanges(baseCommit, file);
    const functions = computeFunctionComplexities(readFile(file), file);
    for (const fn of functions) {
      const isTouched = rangesOverlap(changedRanges, fn.startLine, fn.endLine);
      rows.push({
        file,
        line: fn.startLine,
        name: fn.name,
        complexity: fn.complexity,
        isOffender: isTouched && fn.complexity > options.maxComplexity,
      });
    }
  }
  return rows;
}

function main(): void {
  const options = parseArgs(process.argv.slice(2));
  const rows = options.focusPaths.length > 0 ? runFocusedMode(options) : runDiffMode(options);

  if (rows.length === 0) {
    console.log('No functions to check.');
    return;
  }

  console.log(formatTable(rows, options.maxComplexity));

  if (rows.some((row) => row.isOffender)) {
    process.exitCode = 1;
  }
}

try {
  main();
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
}
