import fs from 'fs';
import os from 'os';
import path from 'path';

import { afterEach, describe, expect, it } from 'vitest';

import { appendGap, formatGapLine, GAP_LOG_HEADER, gapLogPath } from './gaps';
import type { Correction, NodeRecord } from './sidecar';

let tmp = '';

afterEach(() => {
  if (tmp) fs.rmSync(tmp, { recursive: true, force: true });
  tmp = '';
});

const NODE: NodeRecord = {
  id: '22842:178386',
  values: {
    kind: 'text',
    text: '1248139',
    trailingGlyphs: undefined,
    font: { family: 'Inter', weight: 500, size: 14, lineHeight: 20 },
    colors: [ { role: 'text', hex: '#63B3ED', alpha: 1 } ],
  },
  bbox: null,
  decision: { signal: 'number', value: '1248139', entities: [ 'block', 'batch', 'epoch' ] },
  status: 'recognized',
  tokens: [ { role: 'text', color: '#63B3ED', tokens: [ 'link.primary' ] } ],
  composite: null,
  correction: null,
};

const CORRECTION: Correction = {
  component: 'BlockEntity',
  props: [ 'noIcon', 'size=sm' ],
  gap: 'context',
  recordedAt: '2026-10-07T09:30:00.000Z',
  stale: false,
};

const ENTRY = { date: '2026-10-07', fileKey: 'KEY', nodeId: '22842:178386', correction: CORRECTION, node: NODE };

describe('gapLogPath', () => {
  it('sits beside the sidecars under the main checkout', () => {
    expect(gapLogPath('/repo')).toBe(path.join('/repo', '.ai', 'design-readout', 'gaps.md'));
  });
});

describe('formatGapLine', () => {
  it('is one line: date, file key, node id, category, what the tool said, what the developer said', () => {
    expect(formatGapLine(ENTRY)).toBe([
      '- 2026-10-07 | KEY | 22842:178386 | context | ',
      'recognized: 22842:178386 text "1248139" — Inter 500 14/20; text #63B3ED — number: block or batch or epoch | BlockEntity noIcon size=sm',
    ].join(''));
  });

  it('writes a bare component when the correction has no props', () => {
    expect(formatGapLine({ ...ENTRY, correction: { ...CORRECTION, props: [] } })).toMatch(/ \| BlockEntity$/);
  });
});

describe('appendGap', () => {
  it('creates the file with the header line on first write and only appends afterwards', () => {
    tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'design-readout-gaps-'));
    const target = gapLogPath(tmp);
    const first = appendGap(target, ENTRY);
    const second = appendGap(target, { ...ENTRY, date: '2026-10-08', nodeId: '1:1', correction: { ...CORRECTION, gap: 'shape' } });
    expect(fs.readFileSync(target, 'utf8')).toBe(`${ GAP_LOG_HEADER }\n${ first }\n${ second }\n`);
    expect(second).toMatch(/^- 2026-10-08 \| KEY \| 1:1 \| shape \| /);
  });
});
