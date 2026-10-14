import { describe, expect, it } from 'vitest';

import { carryCorrections, diffRecords, renderRerun } from './rerun';
import type { Correction, NodeRecord, Override, SidecarRecord } from './sidecar';

const TEXT: NodeRecord = {
  id: '1:2',
  values: {
    kind: 'text',
    text: '1248139',
    trailingGlyphs: undefined,
    font: { family: 'Inter', weight: 500, size: 14, lineHeight: 20 },
    colors: [ { role: 'text', hex: '#63B3ED', alpha: 1 } ],
  },
  bbox: { x: 0, y: 0, width: 60, height: 20 },
  decision: { signal: 'number', value: '1248139', entities: [ 'block', 'batch', 'epoch' ] },
  status: 'recognized',
  tokens: [ { role: 'text', color: '#63B3ED', tokens: [ 'link.primary' ] } ],
  composite: null,
  correction: null,
  override: null,
};

const ICON: NodeRecord = {
  id: '1:3',
  values: { kind: 'icon', icon: 'Icons/block', colors: [] },
  bbox: { x: 70, y: 0, width: 20, height: 20 },
  decision: null,
  status: 'unrecognized',
  tokens: [],
  composite: null,
  correction: null,
  override: null,
};

const CORRECTION: Correction = { component: 'BlockEntity', props: [ 'noIcon' ], gap: 'context', recordedAt: '2026-10-06T12:00:00.000Z', stale: false };
const OVERRIDE: Override = { props: [ 'bg=whiteAlpha.100', 'fontWeight=500' ], recordedAt: '2026-10-06T12:30:00.000Z', stale: false };

function record(nodes: ReadonlyArray<NodeRecord>, overrides: Partial<SidecarRecord> = {}): SidecarRecord {
  return {
    version: 2,
    createdAt: '2026-10-06T10:00:00.000Z',
    fileKey: 'KEY',
    nodeId: '1:1',
    file: { lastModified: '2026-10-01T00:00:00Z', version: '42' },
    colorMode: 'light',
    regions: [ '1:1' ],
    nodes,
    ...overrides,
  };
}

const LATER: Partial<SidecarRecord> = { createdAt: '2026-10-07T10:00:00.000Z', file: { lastModified: '2026-10-07T00:00:00Z', version: '43' } };

function withText(node: NodeRecord, text: string): NodeRecord {
  if (node.values.kind !== 'text') throw new Error('not a text node');
  return { ...node, values: { ...node.values, text } };
}

describe('diffRecords', () => {
  it('reports an identical node as unchanged, and a box move alone as unchanged too', () => {
    const moved = { ...TEXT, bbox: { x: 5, y: 5, width: 60, height: 20 } };
    expect(diffRecords(record([ TEXT ]), record([ moved ], LATER)).changes).toEqual([ { kind: 'unchanged', node: moved } ]);
  });

  it('reports a node whose only difference is a key JSON dropped on the way to disk as unchanged', () => {
    const fromDisk = JSON.parse(JSON.stringify(TEXT)) as NodeRecord;
    expect(fromDisk.values).not.toHaveProperty('trailingGlyphs');
    expect(diffRecords(record([ fromDisk ]), record([ TEXT ], LATER)).changes).toEqual([ { kind: 'unchanged', node: TEXT } ]);
    expect(carryCorrections(record([ { ...fromDisk, correction: CORRECTION } ]), record([ TEXT ], LATER)).nodes[0].correction).toEqual(CORRECTION);
  });

  it('reports changed values, a changed decision, and both, naming which', () => {
    const newText = withText(TEXT, '1248140');
    const newDecision: NodeRecord = { ...TEXT, status: 'ambiguous' };
    const both: NodeRecord = { ...withText(TEXT, 'abc'), decision: null, status: 'unrecognized' };
    expect(diffRecords(record([ TEXT ]), record([ newText ], LATER)).changes).toEqual([
      { kind: 'changed', previous: TEXT, next: newText, values: true, decision: false },
    ]);
    expect(diffRecords(record([ TEXT ]), record([ newDecision ], LATER)).changes).toEqual([
      { kind: 'changed', previous: TEXT, next: newDecision, values: false, decision: true },
    ]);
    expect(diffRecords(record([ TEXT ]), record([ both ], LATER)).changes).toEqual([
      { kind: 'changed', previous: TEXT, next: both, values: true, decision: true },
    ]);
  });

  it('lists new nodes in the new order and vanished nodes after them', () => {
    const { changes } = diffRecords(record([ TEXT ]), record([ ICON ], LATER));
    expect(changes).toEqual([ { kind: 'new', node: ICON }, { kind: 'vanished', node: TEXT } ]);
  });

  it('carries both runs\' identity for the header', () => {
    const diff = diffRecords(record([]), record([], LATER));
    expect(diff.previous).toEqual({ createdAt: '2026-10-06T10:00:00.000Z', file: { lastModified: '2026-10-01T00:00:00Z', version: '42' }, colorMode: 'light' });
    expect(diff.next).toEqual({ createdAt: '2026-10-07T10:00:00.000Z', file: { lastModified: '2026-10-07T00:00:00Z', version: '43' }, colorMode: 'light' });
  });
});

describe('carryCorrections', () => {
  const corrected: NodeRecord = { ...TEXT, correction: CORRECTION };

  it('keeps a correction on an unchanged node as it was', () => {
    const merged = carryCorrections(record([ corrected ]), record([ TEXT ], LATER));
    expect(merged.nodes[0].correction).toEqual(CORRECTION);
    expect(merged.createdAt).toBe('2026-10-07T10:00:00.000Z');
  });

  it('keeps a correction on a node whose values changed, flagged stale', () => {
    const merged = carryCorrections(record([ corrected ]), record([ withText(TEXT, '1248140') ], LATER));
    expect(merged.nodes[0].correction).toEqual({ ...CORRECTION, stale: true });
  });

  it('keeps a correction unflagged when only the tool\'s decision changed', () => {
    const merged = carryCorrections(record([ corrected ]), record([ { ...TEXT, status: 'ambiguous' } ], LATER));
    expect(merged.nodes[0].correction).toEqual(CORRECTION);
  });

  it('never un-flags a stale correction on its own', () => {
    const stale = { ...corrected, correction: { ...CORRECTION, stale: true } };
    expect(carryCorrections(record([ stale ]), record([ TEXT ], LATER)).nodes[0].correction).toEqual({ ...CORRECTION, stale: true });
  });

  it('gives a new node no correction and drops the one of a vanished node', () => {
    const merged = carryCorrections(record([ corrected ]), record([ ICON ], LATER));
    expect(merged.nodes).toEqual([ ICON ]);
  });

  describe('override', () => {
    const overridden: NodeRecord = { ...TEXT, correction: CORRECTION, override: OVERRIDE };

    it('keeps an override on an unchanged node as it was, beside the correction', () => {
      const merged = carryCorrections(record([ overridden ]), record([ TEXT ], LATER));
      expect(merged.nodes[0]).toEqual(overridden);
    });

    it('keeps an override on a node whose values changed, flagged stale', () => {
      const merged = carryCorrections(record([ overridden ]), record([ withText(TEXT, '1248140') ], LATER));
      expect(merged.nodes[0].override).toEqual({ ...OVERRIDE, stale: true });
      expect(merged.nodes[0].correction).toEqual({ ...CORRECTION, stale: true });
    });

    it('keeps an override unflagged when only the tool\'s decision changed, and never un-flags a stale one', () => {
      expect(carryCorrections(record([ overridden ]), record([ { ...TEXT, status: 'ambiguous' } ], LATER)).nodes[0].override).toEqual(OVERRIDE);
      const stale = { ...TEXT, override: { ...OVERRIDE, stale: true } };
      expect(carryCorrections(record([ stale ]), record([ TEXT ], LATER)).nodes[0].override).toEqual({ ...OVERRIDE, stale: true });
    });

    it('gives a new node no override and drops the one of a vanished node', () => {
      const merged = carryCorrections(record([ overridden ]), record([ ICON ], LATER));
      expect(merged.nodes).toEqual([ ICON ]);
    });
  });
});

describe('renderRerun', () => {
  it('prints the header, the counts with corrections, and only the changed, new and vanished nodes', () => {
    const corrected: NodeRecord = { ...TEXT, correction: CORRECTION };
    const previous = record([ corrected, ICON, { ...ICON, id: '1:4' } ]);
    const recognizedIcon: NodeRecord = { ...ICON, id: '1:5', decision: { signal: 'icon', icon: 'block' }, status: 'recognized' };
    const next = carryCorrections(previous, record([ withText(TEXT, '1248140'), ICON, recognizedIcon ], { ...LATER, colorMode: 'dark' }));
    expect(renderRerun(diffRecords(previous, next))).toBe([
      'Re-run against the sidecar of 2026-10-06T10:00:00.000Z: file version 42 → 43, color mode light → dark',
      'Unchanged: 1 (0 recognized by correction)',
      'Changed: 3',
      '  ~ 1:2 changed values; correction BlockEntity noIcon (context) is now STALE, re-confirm it',
      '      was 1:2 text "1248139" — Inter 500 14/20; text #63B3ED — number: block or batch or epoch',
      '      now 1:2 text "1248140" — Inter 500 14/20; text #63B3ED — number: block or batch or epoch',
      '  + new 1:5 icon "Icons/block" —  — icon "block"',
      '  - vanished 1:4',
    ].join('\n'));
  });

  it('counts an unchanged corrected node as recognized by correction and says a kept correction is kept', () => {
    const corrected: NodeRecord = { ...TEXT, correction: CORRECTION };
    const previous = record([ corrected, { ...ICON, correction: { ...CORRECTION, component: 'IconSvg' } } ]);
    const next = carryCorrections(previous, record([ TEXT, { ...ICON, status: 'ambiguous' } ], LATER));
    expect(renderRerun(diffRecords(previous, next))).toContain('Unchanged: 1 (1 recognized by correction)');
    expect(renderRerun(diffRecords(previous, next))).toContain('  ~ 1:3 changed decision; correction IconSvg noIcon (context) kept');
  });

  it('says when a vanished node takes its correction with it', () => {
    const previous = record([ { ...TEXT, correction: CORRECTION } ]);
    const next = carryCorrections(previous, record([], LATER));
    expect(renderRerun(diffRecords(previous, next))).toContain('  - vanished 1:2; its correction BlockEntity noIcon (context) is dropped');
  });

  it('names an override on a changed line, stale or kept, after the correction when both exist', () => {
    const previous = record([ { ...TEXT, correction: CORRECTION, override: OVERRIDE }, { ...ICON, override: OVERRIDE } ]);
    const next = carryCorrections(previous, record([ withText(TEXT, '1248140'), { ...ICON, status: 'ambiguous' } ], LATER));
    const text = renderRerun(diffRecords(previous, next));
    expect(text).toContain([
      '  ~ 1:2 changed values; correction BlockEntity noIcon (context) is now STALE, re-confirm it',
      '; override bg=whiteAlpha.100 fontWeight=500 is now STALE, re-confirm it',
    ].join(''));
    expect(text).toContain('  ~ 1:3 changed decision; override bg=whiteAlpha.100 fontWeight=500 kept');
  });

  it('says when a vanished node takes its override with it, and marks an already stale one', () => {
    const previous = record([ { ...TEXT, override: { ...OVERRIDE, stale: true } } ]);
    const next = carryCorrections(previous, record([], LATER));
    expect(renderRerun(diffRecords(previous, next))).toContain('  - vanished 1:2; its override bg=whiteAlpha.100 fontWeight=500 (STALE) is dropped');
  });
});
