import type { FunctionComplexity } from '../../code-complexity/measure/complexity';
import { computeFunctionComplexities } from '../../code-complexity/measure/complexity';
import type { LineRange } from '../../code-complexity/select/diff';

// Which lines of a file Stryker may create mutants on. Two restrictions compose: a `jsx` function
// body is never mutated, and under --changed only the lines the diff touched are.
//
// Stryker's `mutate` option takes ranges but has no exclude form, so an exclusion is expressed as
// the complement — the spans of the file no `jsx` body covers.

function countLines(source: string): number {
  // A trailing newline ends the last line rather than starting another one, so a whole-file range
  // never reaches past the end of the file.
  return source.replace(/\n+$/, '').split('\n').length;
}

function coversTheSameLines(fn: FunctionComplexity, other: FunctionComplexity): boolean {
  return fn.startLine === other.startLine && fn.endLine === other.endLine;
}

// A line belongs to the innermost function containing it: a `useCallback` body inside a component is
// `behavior` even though the component around it renders JSX, and a `.map(() => <Row/>)` callback is
// `jsx` even though the `useMemo` around it is `behavior`.
//
// computeFunctionComplexities reports a nested function before the one enclosing it, so the first
// function containing the line is the innermost one and no nesting test is needed. The one case the
// order does not settle is a tie — two functions covering exactly the same lines — where `jsx`
// wins, because an unkillable survivor costs more than a mutant that was never generated.
function innermostFunctionAt(functions: ReadonlyArray<FunctionComplexity>, line: number): FunctionComplexity | undefined {
  let innermost: FunctionComplexity | undefined;

  for (const fn of functions) {
    if (fn.startLine > line || fn.endLine < line) continue;
    if (innermost === undefined || (coversTheSameLines(fn, innermost) && fn.containsJsx)) innermost = fn;
  }

  return innermost;
}

// Consecutive lines collapse, so a file with no JSX in it comes out as one span rather than one
// range per line.
function toRanges(lines: ReadonlyArray<number>): Array<LineRange> {
  const ranges: Array<LineRange> = [];

  for (const line of lines) {
    const last = ranges[ranges.length - 1];
    if (last !== undefined && last[1] === line - 1) last[1] = line;
    else ranges.push([ line, line ]);
  }

  return ranges;
}

// Every line whose innermost enclosing function is not a `jsx` body — module scope included, since a
// line belonging to no function belongs to no render body either.
export function mutableLineRanges(source: string, fileName: string): Array<LineRange> {
  const functions = computeFunctionComplexities(source, fileName);
  const lastLine = countLines(source);
  const lines: Array<number> = [];

  for (let line = 1; line <= lastLine; line++) {
    const innermost = innermostFunctionAt(functions, line);
    if (innermost === undefined || !innermost.containsJsx) lines.push(line);
  }

  return toRanges(lines);
}

export function intersectRanges(first: ReadonlyArray<LineRange>, second: ReadonlyArray<LineRange>): Array<LineRange> {
  const ranges: Array<LineRange> = [];

  for (const [ firstStart, firstEnd ] of first) {
    for (const [ secondStart, secondEnd ] of second) {
      const start = Math.max(firstStart, secondStart);
      const end = Math.min(firstEnd, secondEnd);
      if (start <= end) ranges.push([ start, end ]);
    }
  }

  return ranges;
}

// The ranges one file contributes to a run. `changedRanges` is undefined outside --changed, where the
// whole file (minus its `jsx` bodies) is mutated. An empty result means the file has nothing left to
// mutate and is dropped from the selection.
export function computeMutationRanges(
  source: string,
  fileName: string,
  changedRanges: ReadonlyArray<LineRange> | undefined,
): Array<LineRange> {
  const mutable = mutableLineRanges(source, fileName);
  return changedRanges === undefined ? mutable : intersectRanges(mutable, changedRanges);
}
