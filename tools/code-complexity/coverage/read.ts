import fs from 'fs';

interface SourcePosition {
  readonly line: number;
}

interface StatementRange {
  readonly start: SourcePosition;
}

interface IstanbulFileCoverage {
  readonly path?: string;
  readonly statementMap: Record<string, StatementRange>;
  readonly s: Record<string, number>;
}

type CoverageJson = Record<string, IstanbulFileCoverage>;

// line number (1-based) -> hit count. A line present with count 0 is coverable but unexecuted.
export type LineHits = ReadonlyMap<number, number>;

export interface CoverageData {
  // Line coverage for a repo-relative path, or undefined when the file is absent from the report.
  readonly lineHitsFor: (relativePath: string) => LineHits | undefined;
}

function buildLineHits(fileCoverage: IstanbulFileCoverage): Map<number, number> {
  const lineHits = new Map<number, number>();
  for (const [ id, count ] of Object.entries(fileCoverage.s)) {
    const statement = fileCoverage.statementMap[id];
    if (!statement) continue;
    const { line } = statement.start;
    const previous = lineHits.get(line);
    if (previous === undefined || previous < count) lineHits.set(line, count);
  }
  return lineHits;
}

export function parseCoverage(jsonText: string): CoverageData {
  const raw = JSON.parse(jsonText) as CoverageJson;

  // The report keys files by absolute path; the gate looks them up by repo-relative path, so match
  // on a path suffix (`.../src/foo.ts` ends with `src/foo.ts`). Line maps are built once up front.
  const entries = Object.entries(raw).map(([ key, fileCoverage ]) => ({
    path: (fileCoverage.path ?? key).replace(/\\/g, '/'),
    lineHits: buildLineHits(fileCoverage),
  }));

  return {
    lineHitsFor(relativePath: string): LineHits | undefined {
      const relative = relativePath.replace(/\\/g, '/');
      const match = entries.find((entry) => entry.path === relative || entry.path.endsWith(`/${ relative }`));
      return match?.lineHits;
    },
  };
}

export function readCoverage(filePath: string): CoverageData {
  return parseCoverage(fs.readFileSync(filePath, 'utf8'));
}

// A vitest run that covered nothing writes no report at all, so an absent file means "nothing was
// covered", not a broken invocation.
export function readCoverageOrEmpty(filePath: string): CoverageData {
  return fs.existsSync(filePath) ? readCoverage(filePath) : parseCoverage('{}');
}

// Fraction (0..1) of the coverable lines in [startLine, endLine] that were executed. A function with
// no coverable lines (e.g. a bare type-only body) counts as fully covered.
export function functionLineCoverage(lineHits: LineHits, startLine: number, endLine: number): number {
  let coverable = 0;
  let covered = 0;
  for (const [ line, hits ] of lineHits) {
    if (line < startLine || line > endLine) continue;
    coverable++;
    if (hits > 0) covered++;
  }
  return coverable === 0 ? 1 : covered / coverable;
}
