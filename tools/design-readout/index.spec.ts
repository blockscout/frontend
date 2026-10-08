import fs from 'fs';
import os from 'os';
import path from 'path';

import { afterEach, describe, expect, it } from 'vitest';

import type { NodeEntry, NodesResponse } from './figma';
import { entryOf } from './figma';
import { GAP_LOG_HEADER, gapLogPath } from './gaps';
import type { CliOptions, CorrectionRequest, OverrideRequest } from './index';
import { dumpPayload, parseArgs, readoutOf, recordCorrection, recordOverride } from './index';
import { loadSpriteNames } from './recognize';
import { buildRecord, readSidecar, sidecarPath, writeSidecar } from './sidecar';

const URL = 'https://www.figma.com/design/abcDEF0123456789abcDEF/Pages?node-id=22842-174340';

function readFixture(file: string, nodeId: string): NodeEntry {
  const payload = JSON.parse(fs.readFileSync(path.join(__dirname, 'fixtures', file), 'utf8')) as NodesResponse;
  return entryOf(payload, nodeId);
}

function readout(argv: ReadonlyArray<string>): CliOptions {
  const parsed = parseArgs(argv);
  if (parsed.kind !== 'readout') throw new Error(`Expected a readout, got ${ parsed.kind }`);
  return parsed.options;
}

function correction(argv: ReadonlyArray<string>): CorrectionRequest {
  const parsed = parseArgs(argv);
  if (parsed.kind !== 'correct') throw new Error(`Expected a correction, got ${ parsed.kind }`);
  return parsed.correction;
}

function override(argv: ReadonlyArray<string>): OverrideRequest {
  const parsed = parseArgs(argv);
  if (parsed.kind !== 'override') throw new Error(`Expected an override, got ${ parsed.kind }`);
  return parsed.override;
}

describe('parseArgs', () => {
  it('takes the node URL as the one positional and --dump in both forms', () => {
    expect(parseArgs([ URL ])).toEqual({
      kind: 'readout',
      options: { dump: undefined, regions: undefined, correct: undefined, gap: undefined, override: undefined, calibrate: false, refresh: false },
      ref: { fileKey: 'abcDEF0123456789abcDEF', nodeId: '22842:174340' },
    });
    expect(readout([ URL, '--dump', 'out.json' ]).dump).toBe('out.json');
    expect(readout([ '--dump=out.json', URL ]).dump).toBe('out.json');
  });

  it('takes --regions as comma-separated node ids in either form, nested ones included, canonicalized', () => {
    expect(readout([ URL, '--regions', '1-2, 3:4,I5-6;7-8' ]).regions).toEqual([ '1:2', '3:4', 'I5:6;7:8' ]);
    expect(() => parseArgs([ URL, '--regions', '1-2,abc' ])).toThrow(/Not a node id in --regions: abc\nUsage:/);
  });

  it('takes --calibrate and --refresh [<entry>] without a URL, and rejects a URL or a per-node flag with them', () => {
    expect(parseArgs([ '--calibrate' ])).toEqual({ kind: 'calibrate' });
    expect(parseArgs([ '--refresh' ])).toEqual({ kind: 'refresh', entry: undefined });
    expect(parseArgs([ '--refresh', 'blocks-table-item' ])).toEqual({ kind: 'refresh', entry: 'blocks-table-item' });
    expect(() => parseArgs([ '--calibrate', URL ])).toThrow(/--calibrate takes no argument: https/);
    expect(() => parseArgs([ '--refresh', 'a', 'b' ])).toThrow(/--refresh takes at most one entry name: a b/);
    expect(() => parseArgs([ '--calibrate', '--refresh' ])).toThrow(/--calibrate and --refresh are separate runs/);
    expect(() => parseArgs([ '--calibrate', '--dump', 'x' ])).toThrow(/--calibrate works on the calibration set and takes no per-node flag/);
    expect(() => parseArgs([ '--refresh', '--gap', 'shape' ])).toThrow(/--refresh works on the calibration set and takes no per-node flag/);
    expect(() => parseArgs([ '--calibrate', '--override', '1-2' ])).toThrow(/--calibrate works on the calibration set and takes no per-node flag/);
  });

  it('takes --override with the node id and one or more prop=value words', () => {
    expect(parseArgs([ URL, '--override', '22842-178386', 'bg=whiteAlpha.100', 'fontWeight=500' ])).toEqual({
      kind: 'override',
      ref: { fileKey: 'abcDEF0123456789abcDEF', nodeId: '22842:174340' },
      override: { nodeId: '22842:178386', props: [ 'bg=whiteAlpha.100', 'fontWeight=500' ] },
    });
    expect(override([ '--override=I1:2;3:4', URL, 'color=text.primary' ])).toEqual({ nodeId: 'I1:2;3:4', props: [ 'color=text.primary' ] });
  });

  it('rejects --override with --correct or --gap, with no word, with a word that is not prop=value, and with a bad node id', () => {
    expect(() => parseArgs([ URL, '--override', '1-2', 'bg=x', '--correct', '1-2', 'Box', '--gap', 'color' ]))
      .toThrow(/--override and --correct are separate runs: an override is never a miss and takes no --gap\nUsage:/);
    expect(() => parseArgs([ URL, '--override', '1-2', 'bg=x', '--gap', 'color' ])).toThrow(/--override and --correct are separate runs/);
    expect(() => parseArgs([ URL, '--override', '1-2' ])).toThrow(/--override 1:2 needs at least one <prop>=<value> word, after the URL\nUsage:/);
    expect(() => parseArgs([ URL, '--override', '1-2', 'noIcon' ])).toThrow(/An override is one <prop>=<value> per word, no spaces inside: noIcon\nUsage:/);
    expect(() => parseArgs([ URL, '--override', '1-2', 'bg=' ])).toThrow(/An override is one <prop>=<value> per word, no spaces inside: bg=/);
    expect(() => parseArgs([ URL, '--override', 'abc', 'bg=x' ])).toThrow(/Not a node id in --override: abc\nUsage:/);
  });

  it('rejects a missing, extra or malformed URL with the usage line', () => {
    expect(() => parseArgs([])).toThrow(/Missing the Figma node URL\nUsage:/);
    expect(() => parseArgs([ URL, URL ])).toThrow(/Unexpected argument/);
    expect(() => parseArgs([ '22842:174340' ])).toThrow(/Not a Figma node URL: 22842:174340\nUsage:/);
    expect(() => parseArgs([ URL, '--json' ])).toThrow(/Unknown flag: --json/);
  });

  it('takes --correct with the node id, the component and its props as words, and the --gap category', () => {
    expect(parseArgs([ URL, '--correct', '22842-178386', 'BlockEntity', 'noIcon', 'size=sm', '--gap', 'context' ])).toEqual({
      kind: 'correct',
      ref: { fileKey: 'abcDEF0123456789abcDEF', nodeId: '22842:174340' },
      correction: { nodeId: '22842:178386', component: 'BlockEntity', props: [ 'noIcon', 'size=sm' ], gap: 'context' },
    });
    expect(correction([ '--gap=icon', URL, '--correct=I1:2;3:4', 'IconSvg' ])).toEqual({ nodeId: 'I1:2;3:4', component: 'IconSvg', props: [], gap: 'icon' });
  });

  it('rejects a correction without --gap, because a correction is always a miss', () => {
    expect(() => parseArgs([ URL, '--correct', '1-2', 'BlockEntity' ]))
      .toThrow(/A correction is always a miss: --correct needs --gap <shape\|icon\|color\|composite\|context\|layout\|convention>\nUsage:/);
  });

  it('rejects a bad category, a correction with no component, a bad node id, and --gap on its own', () => {
    expect(() => parseArgs([ URL, '--correct', '1-2', 'BlockEntity', '--gap', 'typo' ]))
      .toThrow(/Not a gap category: typo; --gap takes one of shape, icon, color, composite, context, layout, convention\nUsage:/);
    expect(() => parseArgs([ URL, '--correct', '1-2', '--gap', 'shape' ])).toThrow(/--correct 1:2 needs the component the node is, after the URL\nUsage:/);
    expect(() => parseArgs([ URL, '--correct', 'abc', 'BlockEntity', '--gap', 'shape' ])).toThrow(/Not a node id in --correct: abc\nUsage:/);
    expect(() => parseArgs([ URL, '--gap', 'shape' ])).toThrow(/--gap goes with --correct/);
  });
});

describe('recordCorrection', () => {
  const ref = { fileKey: 'KEY', nodeId: '22842:178383' };
  const request = { nodeId: '22842:178386', component: 'BlockEntity', props: [ 'noIcon' ], gap: 'context' as const };
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
      '- 2026-10-07 | KEY | 22842:178386 | context | ',
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
    const request = { nodeId: '22842:178386', component: 'BlockEntity', props: [ 'noIcon' ], gap: 'context' as const };
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
      [ { role: 'text', color: '#FFFFFF/80', tokens: [ 'link.menu', 'link.navigation.fg', 'text.primary' ] } ],
      [ { role: 'text', color: '#FFFFFF/80', tokens: [ 'link.menu', 'link.navigation.fg', 'text.primary' ] } ],
      [ { role: 'text', color: '#FFFFFF/80', tokens: [ 'link.menu', 'link.navigation.fg', 'text.primary' ] } ],
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
