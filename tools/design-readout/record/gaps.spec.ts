import fs from 'fs';
import os from 'os';
import path from 'path';

import { afterEach, describe, expect, it } from 'vitest';

import { appendGap, formatGapLine, GAP_LOG_HEADER, gapLogPath, gapOfCorrection, gapOfNote } from './gaps';
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
  override: null,
};

const CORRECTION: Correction = {
  component: 'BlockEntity',
  props: [ 'noIcon', 'size=sm' ],
  gap: 'context',
  recordedAt: '2026-10-07T09:30:00.000Z',
  stale: false,
};

const CORRECTION_GAP = { date: '2026-10-07', fileKey: 'KEY', nodeId: '22842:178386', correction: CORRECTION, node: NODE };
const ENTRY = gapOfCorrection(CORRECTION_GAP);
const NOTE = gapOfNote({ date: '2026-10-09', fileKey: 'KEY', gap: 'markup', text: 'the row gap is 8px in the app, 12px in the mockup' });

describe('gapLogPath', () => {
  it('sits beside the sidecars under the main checkout', () => {
    expect(gapLogPath('/repo')).toBe(path.join('/repo', '.ai', 'design-readout', 'gaps.md'));
  });
});

describe('gapOfCorrection', () => {
  it('is a readout-stage miss on the corrected node, in the tool\'s words against the developer\'s', () => {
    expect(ENTRY).toEqual({
      date: '2026-10-07',
      fileKey: 'KEY',
      nodeId: '22842:178386',
      gap: 'context',
      stage: 'readout',
      toolSaid: 'recognized: 22842:178386 text "1248139" — Inter 500 14/20; text #63B3ED — number: block or batch or epoch',
      developerSaid: 'BlockEntity noIcon size=sm',
    });
  });

  it('writes a bare component when the correction has no props', () => {
    expect(gapOfCorrection({ ...CORRECTION_GAP, correction: { ...CORRECTION, props: [] } }).developerSaid).toBe('BlockEntity');
  });
});

describe('gapOfNote', () => {
  it('is a markup-stage miss with no node and nothing the tool said', () => {
    expect(NOTE).toEqual({
      date: '2026-10-09',
      fileKey: 'KEY',
      nodeId: '',
      gap: 'markup',
      stage: 'markup',
      toolSaid: '',
      developerSaid: 'the row gap is 8px in the app, 12px in the mockup',
    });
  });
});

describe('formatGapLine', () => {
  it('is one line: date, file key, node id, category, stage, what the tool said, what the developer said', () => {
    expect(formatGapLine(ENTRY)).toBe([
      '- 2026-10-07 | KEY | 22842:178386 | context | readout | ',
      'recognized: 22842:178386 text "1248139" — Inter 500 14/20; text #63B3ED — number: block or batch or epoch | BlockEntity noIcon size=sm',
    ].join(''));
  });

  it('leaves the node id and the tool column empty on a note', () => {
    expect(formatGapLine(NOTE)).toBe('- 2026-10-09 | KEY |  | markup | markup |  | the row gap is 8px in the app, 12px in the mockup');
  });
});

describe('appendGap', () => {
  it('creates the file with the header line on first write and only appends afterwards', () => {
    tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'design-readout-gaps-'));
    const target = gapLogPath(tmp);
    const first = appendGap(target, ENTRY);
    const second = appendGap(target, gapOfCorrection({ ...CORRECTION_GAP, date: '2026-10-08', nodeId: '1:1', correction: { ...CORRECTION, gap: 'shape' } }));
    const third = appendGap(target, NOTE);
    expect(fs.readFileSync(target, 'utf8')).toBe(`${ GAP_LOG_HEADER }\n${ first.line }\n${ second.line }\n${ third.line }\n`);
    expect(second).toEqual({ line: expect.stringMatching(/^- 2026-10-08 \| KEY \| 1:1 \| shape \| readout \| /), appended: true });
    expect(third).toEqual({ line: expect.stringMatching(/^- 2026-10-09 \| KEY \| {2}\| markup \| markup \| {2}\| the row gap/), appended: true });
  });

  it('adds no line for the same miss on another node of the same file, whatever its stage', () => {
    tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'design-readout-gaps-'));
    const target = gapLogPath(tmp);
    const first = appendGap(target, ENTRY);
    const repeat = appendGap(target, gapOfCorrection({ ...CORRECTION_GAP, date: '2026-10-09', nodeId: '1:1', node: { ...NODE, id: '1:1' } }));
    const otherStage = appendGap(target, { ...ENTRY, date: '2026-10-10', stage: 'markup' });
    expect(repeat.appended).toBe(false);
    expect(otherStage.appended).toBe(false);
    expect(fs.readFileSync(target, 'utf8')).toBe(`${ GAP_LOG_HEADER }\n${ first.line }\n`);
  });

  it('adds no line for the same note text under the same file key and category', () => {
    tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'design-readout-gaps-'));
    const target = gapLogPath(tmp);
    const first = appendGap(target, NOTE);
    expect(appendGap(target, { ...NOTE, date: '2026-10-10' }).appended).toBe(false);
    expect(appendGap(target, { ...NOTE, gap: 'layout' }).appended).toBe(true);
    expect(fs.readFileSync(target, 'utf8')).toBe(`${ GAP_LOG_HEADER }\n${ first.line }\n${ formatGapLine({ ...NOTE, gap: 'layout' }) }\n`);
  });

  it('keeps a line for the same values under another file key, category or correction', () => {
    tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'design-readout-gaps-'));
    const target = gapLogPath(tmp);
    appendGap(target, ENTRY);
    expect(appendGap(target, { ...ENTRY, fileKey: 'OTHER' }).appended).toBe(true);
    expect(appendGap(target, gapOfCorrection({ ...CORRECTION_GAP, correction: { ...CORRECTION, gap: 'shape' } })).appended).toBe(true);
    expect(appendGap(target, gapOfCorrection({ ...CORRECTION_GAP, correction: { ...CORRECTION, props: [] } })).appended).toBe(true);
    expect(fs.readFileSync(target, 'utf8').split('\n').filter((line) => line.startsWith('- '))).toHaveLength(4);
  });
});
