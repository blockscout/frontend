import { describe, it, expect } from 'vitest';

import type { ReportRow } from './report';
import { formatTable } from './report';

const THRESHOLDS = { maxCognitiveJsx: 25, maxCognitiveBehavior: 20, maxCrap: 30 };

function row(overrides: Partial<ReportRow>): ReportRow {
  return {
    file: 'src/f.ts',
    line: 1,
    name: 'fn',
    kind: 'behavior',
    complexity: 1,
    cognitive: 1,
    contributions: [],
    coverage: null,
    crap: null,
    brokeCognitive: false,
    brokeCrap: false,
    ...overrides,
  };
}

describe('formatTable', () => {
  it('sorts by CRAP descending, null-CRAP rows last', () => {
    const table = formatTable([
      row({ name: 'low', crap: 12, coverage: 0.5 }),
      row({ name: 'jsx', crap: null, coverage: null }),
      row({ name: 'high', crap: 72, coverage: 0 }),
    ], THRESHOLDS);
    const order = table.split('\n').slice(1, 4).map((l) => l.match(/high|low|jsx/)?.[0]);
    expect(order).toEqual([ 'high', 'low', 'jsx' ]);
  });

  it('renders coverage% and CRAP, showing — when the coverage half does not apply', () => {
    const table = formatTable([ row({ name: 'logic', crap: 72, coverage: 0 }), row({ name: 'comp', crap: null, coverage: null }) ], THRESHOLDS);
    expect(table).toContain('0%');
    expect(table).toContain('72.0');
    expect(table).toContain('—');
  });

  it('shows COG (not CX) by default; CX appears only under --verbose', () => {
    const rows = [ row({ name: 'fn', cognitive: 7, complexity: 12, crap: 5, coverage: 1 }) ];
    const header = formatTable(rows, THRESHOLDS).split('\n')[0];
    expect(header).toContain('COG');
    expect(header).not.toMatch(/\bCX\b/);

    const verboseHeader = formatTable(rows, THRESHOLDS, true).split('\n')[0];
    expect(verboseHeader).toContain('COG');
    expect(verboseHeader).toContain('CX');
  });

  it('names which threshold each offender broke', () => {
    const table = formatTable([
      row({ name: 'both', cognitive: 25, crap: 90, coverage: 0, brokeCognitive: true, brokeCrap: true }),
      row({ name: 'crapOnly', cognitive: 8, crap: 72, coverage: 0, brokeCrap: true }),
    ], THRESHOLDS);
    expect(table).toMatch(/both.*COG\+CRAP/);
    expect(table).toMatch(/crapOnly.*CRAP/);
  });

  it('flags offenders and summarises the count', () => {
    const table = formatTable([ row({ crap: 72, coverage: 0, brokeCrap: true }) ], THRESHOLDS);
    expect(table).toContain('✗');
    expect(table).toContain('1 function(s) broke a threshold');
  });

  it('reports all-clear when nothing broke', () => {
    const table = formatTable([ row({ crap: 3, coverage: 1 }) ], THRESHOLDS);
    expect(table).toContain('within thresholds');
  });

  it('renders a KIND column showing each function class', () => {
    const table = formatTable([
      row({ name: 'render', kind: 'jsx', crap: null, coverage: null }),
      row({ name: 'handler', kind: 'behavior', crap: 5, coverage: 1 }),
    ], THRESHOLDS);
    expect(table).toContain('KIND');
    expect(table).toMatch(/render.*jsx/);
    expect(table).toMatch(/handler.*behavior/);
  });
});
