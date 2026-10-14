import fs from 'fs';
import os from 'os';
import path from 'path';

import { afterEach, describe, expect, it } from 'vitest';

import type { NodeEntry, NodesResponse } from '../fetch/figma';
import { entryOf } from '../fetch/figma';
import { loadSpriteNames } from '../recognize/signals';
import { GAP_LOG_HEADER, gapLogPath } from '../record/gaps';
import { buildRecord, readSidecar, sidecarPath, writeSidecar } from '../record/sidecar';
import { dumpPayload, readoutOf, recordCorrection, recordNote, recordOverride } from './commands';

const DARK_PRIMARY_TEXT_TOKENS = [
  'badge.blue_alt.fg', 'badge.gray.fg', 'badge.purple_alt.fg', 'link.menu', 'link.navigation.fg', 'tag.root.clickable.fg', 'tag.root.subtle.fg', 'text.primary',
];

function readFixture(file: string, nodeId: string): NodeEntry {
  const payload = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'fixtures', file), 'utf8')) as NodesResponse;
  return entryOf(payload, nodeId);
}

describe('recordCorrection', () => {
  const ref = { fileKey: 'KEY', nodeId: '22842:178383' };
  const request = { nodeId: '22842:178386', component: 'BlockEntity', props: [ 'noIcon' ], gap: 'context' as const, stage: 'readout' as const };
  let tmp = '';

  afterEach(() => {
    if (tmp) fs.rmSync(tmp, { recursive: true, force: true });
    tmp = '';
  });

  function seedSidecar(): string {
    tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'design-readout-correct-'));
    const entry = readFixture('22842-178383-dark.json', '22842:178383');
    const { regions, extraction, recognitions } = readoutOf(entry, undefined, loadSpriteNames());
    const target = sidecarPath(tmp, ref.fileKey, ref.nodeId);
    writeSidecar(target, buildRecord({
      createdAt: '2026-10-06T10:00:00.000Z',
      fileKey: ref.fileKey,
      nodeId: ref.nodeId,
      lastModified: '2026-10-01T00:00:00Z',
      fileVersion: '42',
      colorMode: extraction.colorMode.mode,
      regions,
      leaves: extraction.leaves,
      recognitions,
    }));
    return target;
  }

  it('writes the correction into the sidecar and appends one line to the gap log, without a fetch', () => {
    const target = seedSidecar();
    const now = new Date('2026-10-07T09:30:00.000Z');
    const { record, gap } = recordCorrection(tmp, ref, request, now);
    const correction = { component: 'BlockEntity', props: [ 'noIcon' ], gap: 'context', recordedAt: '2026-10-07T09:30:00.000Z', stale: false };
    expect(record.nodes.find((node) => node.id === '22842:178386')?.correction).toEqual(correction);
    expect(readSidecar(target)).toEqual(record);
    expect(gap.appended).toBe(true);
    expect(gap.line).toBe([
      '- 2026-10-07 | KEY | 22842:178386 | context | readout | ',
      'recognized: 22842:178386 text "1248139" — Inter 700 14/20; text #63B3ED — number: block or batch or epoch | BlockEntity noIcon',
    ].join(''));
    expect(fs.readFileSync(gapLogPath(tmp), 'utf8')).toBe(`${ GAP_LOG_HEADER }\n${ gap.line }\n`);
  });

  it('fails on a missing sidecar, naming the path it expected', () => {
    tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'design-readout-correct-'));
    expect(() => recordCorrection(tmp, ref, request, new Date())).toThrow(
      `No sidecar for node 22842:178383: run the readout first; it writes ${ sidecarPath(tmp, 'KEY', '22842:178383') }.`,
    );
    expect(fs.existsSync(gapLogPath(tmp))).toBe(false);
  });

  it('fails on a node the sidecar does not hold, and logs no gap', () => {
    seedSidecar();
    expect(() => recordCorrection(tmp, ref, { ...request, nodeId: '9:9' }, new Date())).toThrow(/Node 9:9 is not in the sidecar of 22842:178383/);
    expect(fs.existsSync(gapLogPath(tmp))).toBe(false);
  });
});

describe('recordNote', () => {
  const ref = { fileKey: 'KEY', nodeId: '22842:178383' };
  let tmp = '';

  afterEach(() => {
    if (tmp) fs.rmSync(tmp, { recursive: true, force: true });
    tmp = '';
  });

  it('appends a markup-stage line with an empty node id, with no sidecar on disk', () => {
    tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'design-readout-note-'));
    const gap = recordNote(tmp, ref, { text: 'the row gap is 8px, the mockup has 12px', gap: 'markup' }, new Date('2026-10-09T09:30:00.000Z'));
    expect(gap).toEqual({ line: '- 2026-10-09 | KEY |  | markup | markup |  | the row gap is 8px, the mockup has 12px', appended: true });
    expect(fs.readFileSync(gapLogPath(tmp), 'utf8')).toBe(`${ GAP_LOG_HEADER }\n${ gap.line }\n`);
    expect(fs.existsSync(sidecarPath(tmp, ref.fileKey, ref.nodeId))).toBe(false);
  });

  it('adds no line for the same note again', () => {
    tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'design-readout-note-'));
    const request = { text: 'cells wrap', gap: 'layout' as const };
    const first = recordNote(tmp, ref, request, new Date('2026-10-09T09:30:00.000Z'));
    const repeat = recordNote(tmp, ref, request, new Date('2026-10-10T09:30:00.000Z'));
    expect(repeat).toEqual({ line: first.line.replace('2026-10-09', '2026-10-10'), appended: false });
  });
});

describe('recordOverride', () => {
  const ref = { fileKey: 'KEY', nodeId: '22842:178383' };
  let tmp = '';

  afterEach(() => {
    if (tmp) fs.rmSync(tmp, { recursive: true, force: true });
    tmp = '';
  });

  function seedSidecar(): string {
    tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'design-readout-override-'));
    const entry = readFixture('22842-178383-dark.json', '22842:178383');
    const { regions, extraction, recognitions } = readoutOf(entry, undefined, loadSpriteNames());
    const target = sidecarPath(tmp, ref.fileKey, ref.nodeId);
    writeSidecar(target, buildRecord({
      createdAt: '2026-10-06T10:00:00.000Z',
      fileKey: ref.fileKey,
      nodeId: ref.nodeId,
      lastModified: '2026-10-01T00:00:00Z',
      fileVersion: '42',
      colorMode: extraction.colorMode.mode,
      regions,
      leaves: extraction.leaves,
      recognitions,
    }));
    return target;
  }

  it('writes the override into the sidecar beside an untouched correction, logs no gap, and takes a non-color prop unchecked', () => {
    const target = seedSidecar();
    const request = { nodeId: '22842:178386', component: 'BlockEntity', props: [ 'noIcon' ], gap: 'context' as const, stage: 'readout' as const };
    recordCorrection(tmp, ref, request, new Date('2026-10-07T09:30:00.000Z'));
    fs.rmSync(gapLogPath(tmp));
    const props = [ 'color=link.primary', 'fontWeight=500' ];
    const record = recordOverride(tmp, ref, { nodeId: '22842:178386', props }, new Date('2026-10-08T09:30:00.000Z'));
    const node = record.nodes.find((candidate) => candidate.id === '22842:178386');
    expect(node?.override).toEqual({ props: [ 'color=link.primary', 'fontWeight=500' ], recordedAt: '2026-10-08T09:30:00.000Z', stale: false });
    expect(node?.correction).toEqual({ component: 'BlockEntity', props: [ 'noIcon' ], gap: 'context', recordedAt: '2026-10-07T09:30:00.000Z', stale: false });
    expect(readSidecar(target)).toEqual(record);
    expect(fs.existsSync(gapLogPath(tmp))).toBe(false);
  });

  it('refuses a color prop naming a token the node does not resolve for that role, listing the ones it does', () => {
    const target = seedSidecar();
    const before = fs.readFileSync(target, 'utf8');
    expect(() => recordOverride(tmp, ref, { nodeId: '22842:178386', props: [ 'color=text.primary' ] }, new Date()))
      .toThrow('color=text.primary names a token the mockup does not draw on 22842:178386: the node resolved text tokens link.primary.');
    expect(() => recordOverride(tmp, ref, { nodeId: '22842:178386', props: [ 'bg=whiteAlpha.100' ] }, new Date()))
      .toThrow('bg=whiteAlpha.100 names a token the mockup does not draw on 22842:178386: the node resolved no background fill.');
    const unmapped = readSidecar(target).nodes[0];
    writeSidecar(target, { ...readSidecar(target), nodes: [ { ...unmapped, tokens: [ { role: 'background', color: '#FFFFFF/6', tokens: [] } ] } ] });
    expect(() => recordOverride(tmp, ref, { nodeId: unmapped.id, props: [ 'bg=whiteAlpha.100' ] }, new Date()))
      .toThrow(`bg=whiteAlpha.100 names a token the mockup does not draw on ${ unmapped.id }: the node resolved no token for its background fill #FFFFFF/6.`);
    fs.writeFileSync(target, before);
    expect(fs.readFileSync(target, 'utf8')).toBe(before);
    expect(fs.existsSync(gapLogPath(tmp))).toBe(false);
  });

  it('fails on a missing sidecar and on a node the sidecar does not hold', () => {
    tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'design-readout-override-'));
    expect(() => recordOverride(tmp, ref, { nodeId: '22842:178386', props: [ 'fontWeight=500' ] }, new Date())).toThrow(
      `No sidecar for node 22842:178383: run the readout first; it writes ${ sidecarPath(tmp, 'KEY', '22842:178383') }.`,
    );
    seedSidecar();
    expect(() => recordOverride(tmp, ref, { nodeId: '9:9', props: [ 'fontWeight=500' ] }, new Date()))
      .toThrow(/Node 9:9 is not in the sidecar of 22842:178383/);
  });
});

describe('readoutOf', () => {
  const entry = readFixture('22842-178383-dark.json', '22842:178383');
  const sprites = loadSpriteNames();

  it('defaults the regions to the content root and extracts the leaves under it', () => {
    const { regions, extraction } = readoutOf(entry, undefined, sprites);
    expect(regions).toEqual([ '22842:178383' ]);
    expect(extraction.leaves.map((leaf) => leaf.id)).toEqual([ '22842:178386', '22842:178400', '22842:178403', '22842:178408', '22842:178412' ]);
  });

  it('recognizes one leaf per extracted leaf in the detected dark mode: the block number and the timestamp hit, the gas values do not', () => {
    const { extraction, recognitions } = readoutOf(entry, undefined, sprites);
    expect(extraction.colorMode.mode).toBe('dark');
    expect(recognitions.map(({ id, status, decision, composite }) => ({ id, status, decision, composite }))).toEqual([
      { id: '22842:178386', status: 'recognized', decision: { signal: 'number', value: '1248139', entities: [ 'block', 'batch', 'epoch' ] }, composite: null },
      { id: '22842:178400', status: 'recognized', decision: { signal: 'relative-timestamp', value: '10s ago', entities: [ 'timestamp' ] }, composite: null },
      { id: '22842:178403', status: 'unrecognized', decision: null, composite: null },
      { id: '22842:178408', status: 'unrecognized', decision: null, composite: null },
      { id: '22842:178412', status: 'unrecognized', decision: null, composite: null },
    ]);
    expect(recognitions.map((recognition) => recognition.tokens)).toEqual([
      [ { role: 'text', color: '#63B3ED', tokens: [ 'link.primary' ] } ],
      [ { role: 'text', color: '#A0AEC0', tokens: [ 'link.secondary', 'link.subtle', 'link.subtle.hover', 'text.secondary' ] } ],
      [ { role: 'text', color: '#FFFFFF/80', tokens: DARK_PRIMARY_TEXT_TOKENS } ],
      [ { role: 'text', color: '#FFFFFF/80', tokens: DARK_PRIMARY_TEXT_TOKENS } ],
      [ { role: 'text', color: '#FFFFFF/80', tokens: DARK_PRIMARY_TEXT_TOKENS } ],
    ]);
  });

  it('extracts only under the given regions', () => {
    const { regions, extraction } = readoutOf(entry, [ '22842:178399', '22842:178406' ], sprites);
    expect(regions).toEqual([ '22842:178399', '22842:178406' ]);
    expect(extraction.leaves.map((leaf) => leaf.id)).toEqual([ '22842:178400', '22842:178408' ]);
  });

  it('fails on a region that is not under the node', () => {
    expect(() => readoutOf(entry, [ '1:1' ], sprites)).toThrow('Region 1:1 is not under node 22842:178383.');
  });
});

describe('dumpPayload', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'design-readout-'));

  afterEach(() => {
    fs.rmSync(dir, { recursive: true, force: true });
  });

  it('writes the payload as JSON at the path resolved from cwd, creating folders', () => {
    const payload = { name: 'f', lastModified: 'm', version: 'v', nodes: {} };
    const file = dumpPayload('nested/out.json', payload, dir);
    expect(file).toBe(path.join(dir, 'nested/out.json'));
    expect(JSON.parse(fs.readFileSync(file, 'utf8'))).toEqual(payload);
  });
});
