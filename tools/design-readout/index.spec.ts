import fs from 'fs';
import os from 'os';
import path from 'path';

import { afterEach, describe, expect, it } from 'vitest';

import type { NodeEntry, NodesResponse } from './figma';
import { entryOf } from './figma';
import { dumpPayload, parseArgs, readoutOf } from './index';
import { loadSpriteNames } from './recognize';

const URL = 'https://www.figma.com/design/abcDEF0123456789abcDEF/Pages?node-id=22842-174340';

function readFixture(file: string, nodeId: string): NodeEntry {
  const payload = JSON.parse(fs.readFileSync(path.join(__dirname, 'fixtures', file), 'utf8')) as NodesResponse;
  return entryOf(payload, nodeId);
}

describe('parseArgs', () => {
  it('takes the node URL as the one positional and --dump in both forms', () => {
    expect(parseArgs([ URL ])).toEqual({
      options: { dump: undefined, regions: undefined },
      ref: { fileKey: 'abcDEF0123456789abcDEF', nodeId: '22842:174340' },
    });
    expect(parseArgs([ URL, '--dump', 'out.json' ]).options.dump).toBe('out.json');
    expect(parseArgs([ '--dump=out.json', URL ]).options.dump).toBe('out.json');
  });

  it('takes --regions as comma-separated node ids in either form, canonicalized', () => {
    expect(parseArgs([ URL, '--regions', '1-2, 3:4' ]).options.regions).toEqual([ '1:2', '3:4' ]);
    expect(() => parseArgs([ URL, '--regions', '1-2,abc' ])).toThrow(/Not a node id in --regions: abc\nUsage:/);
  });

  it('rejects a missing, extra or malformed URL with the usage line', () => {
    expect(() => parseArgs([])).toThrow(/Missing the Figma node URL\nUsage:/);
    expect(() => parseArgs([ URL, URL ])).toThrow(/Unexpected argument/);
    expect(() => parseArgs([ '22842:174340' ])).toThrow(/Not a Figma node URL: 22842:174340\nUsage:/);
    expect(() => parseArgs([ URL, '--json' ])).toThrow(/Unknown flag: --json/);
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
