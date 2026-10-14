import fs from 'fs';
import os from 'os';
import path from 'path';

import { afterEach, describe, expect, it } from 'vitest';

import type { CalibrationEntry, Expected, Snapshot } from '.';
import {
  calibrateEntry, calibrateSet, calibrationDir, EXPECTED_FILE, hasMiss, loadCalibration, loadEntry, refreshEntry, renderCalibration, SNAPSHOT_FILE,
  SNAPSHOT_VERSION,
} from '.';
import { TOKEN_ENV } from '../config';
import type { Leaf } from '../extract/values';
import type { NodesResponse } from '../fetch/figma';
import { fetchNodes, FigmaFetchError } from '../fetch/figma';
import { buildThemeColorMap } from '../recognize/colormap';
import { loadSpriteNames } from '../recognize/signals';

const SPRITES = [ 'copy', 'token', 'arrows/east' ];
const URL = 'https://www.figma.com/design/abcDEF0123456789abcDEF/Pages?node-id=1-2';
const BLUE = { role: 'text' as const, hex: '#2B6CB0', alpha: 1 };
const GRAY = { role: 'icon' as const, hex: '#A0AEC0', alpha: 1 };

function text(id: string, content: string, x: number): Leaf {
  return {
    id,
    values: { kind: 'text', text: content, trailingGlyphs: undefined, font: { family: 'Inter', weight: 500, size: 14, lineHeight: 20 }, colors: [ BLUE ] },
    bbox: { x, y: 0, width: 80, height: 20 },
  };
}

function icon(id: string, name: string, x: number): Leaf {
  return { id, values: { kind: 'icon', icon: name, colors: [ GRAY ] }, bbox: { x, y: 0, width: 20, height: 20 } };
}

// A row in reading order: a block number, a copy icon, then a from/to pair with its entity icons.
const LEAVES: ReadonlyArray<Leaf> = [
  text('1:10', '1248139', 0),
  icon('1:11', 'copy', 90),
  icon('1:20', 'Icons/token', 200),
  text('1:21', '0x05a3…f2d1', 228),
  icon('1:22', 'arrows/east', 316),
  icon('1:23', 'token', 344),
  text('1:24', '0xf2d1…05a3', 372),
];

const SNAPSHOT: Snapshot = {
  version: SNAPSHOT_VERSION,
  fileKey: 'abcDEF0123456789abcDEF',
  nodeId: '1:2',
  capturedAt: '2026-10-08T10:00:00.000Z',
  file: { lastModified: '2026-10-01T00:00:00Z', version: '42' },
  regions: [ '1:2' ],
  frameBackground: { hex: '#FFFFFF', alpha: 1 },
  leaves: LEAVES,
};

const EXPECTED: Expected = {
  url: URL,
  nodeId: '1:2',
  component: 'src/slices/block/pages/index/BlocksTableItem.tsx',
  stale: false,
  cells: {
    '1:10': { component: 'BlockEntity', props: { noIcon: true }, shape: 'number', color: { text: 'link.primary' } },
    '1:11': { component: 'BlockEntity', props: { noIcon: true }, icon: 'copy', color: { icon: 'icon.secondary' } },
    '1:21': { component: 'AddressFromTo', props: {}, shape: 'truncated-hash', composite: 'from-to' },
    '1:22': { component: 'AddressFromTo', props: {}, icon: 'arrows/east', composite: 'from-to' },
    '1:24': { component: 'AddressFromTo', props: {}, shape: 'truncated-hash', composite: 'from-to' },
  },
};

let tmp = '';

afterEach(() => {
  if (tmp) fs.rmSync(tmp, { recursive: true, force: true });
  tmp = '';
  fetchMock.resetMocks();
});

function writeEntry(name: string, expected: Expected, snapshot: Snapshot | undefined): string {
  if (!tmp) tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'design-readout-calibration-'));
  const dir = path.join(tmp, name);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, EXPECTED_FILE), JSON.stringify(expected, null, 2));
  if (snapshot !== undefined) fs.writeFileSync(path.join(dir, SNAPSHOT_FILE), JSON.stringify(snapshot, null, 2));
  return dir;
}

function readJson(file: string): unknown {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

describe('loadEntry', () => {
  it('reads the expected cells and the snapshot of one folder, and an entry without a snapshot yet', () => {
    const dir = writeEntry('blocks', EXPECTED, SNAPSHOT);
    expect(loadEntry(dir)).toEqual({ name: 'blocks', dir, expected: EXPECTED, snapshot: SNAPSHOT });
    expect(loadEntry(writeEntry('later', EXPECTED, undefined)).snapshot).toBeUndefined();
  });

  it('rejects a cell keyed by a node id the snapshot has no leaf for', () => {
    const dir = writeEntry('blocks', { ...EXPECTED, cells: { ...EXPECTED.cells, '9:9': { component: 'X', props: {} } } }, SNAPSHOT);
    expect(() => loadEntry(dir))
      .toThrow('Calibration entry blocks: cell 9:9 is not a leaf of its snapshot; the leaves are 1:10, 1:11, 1:20, 1:21, 1:22, 1:23, 1:24.');
  });

  it('rejects a malformed cell, a snapshot of another version, and a missing expected file, naming the file and the path', () => {
    const badCell = { ...EXPECTED, cells: { '1:10': { component: 'BlockEntity', props: {}, shape: 'hash' } } } as unknown as Expected;
    expect(() => loadEntry(writeEntry('cell', badCell, SNAPSHOT))).toThrow(/Not a valid calibration file .*cell\/expected\.json: cells\.1:10\.shape: /);
    expect(() => loadEntry(writeEntry('version', EXPECTED, { ...SNAPSHOT, version: 0 }))).toThrow(/version\/snapshot\.json: version: /);
    expect(() => loadEntry(writeEntry('url', { ...EXPECTED, url: 'https://example.com' }, SNAPSHOT))).toThrow(/url: not a Figma node URL/);
    const empty = path.join(writeEntry('x', EXPECTED, undefined), '..', 'empty');
    fs.mkdirSync(empty);
    expect(() => loadEntry(empty)).toThrow('Calibration entry empty has no expected.json.');
  });
});

describe('loadCalibration', () => {
  it('loads every sub-folder in name order and ignores files at the top level', () => {
    writeEntry('b', EXPECTED, SNAPSHOT);
    writeEntry('a', EXPECTED, SNAPSHOT);
    fs.writeFileSync(path.join(tmp, 'README.md'), 'not an entry');
    expect(loadCalibration(tmp).map((entry) => entry.name)).toEqual([ 'a', 'b' ]);
    expect(() => loadCalibration(path.join(tmp, 'nowhere'))).toThrow(/No calibration set at /);
  });

  it('is under the repo root', () => {
    expect(calibrationDir('/repo')).toBe(path.join('/repo', 'tools', 'design-readout', 'calibration', 'entries'));
  });
});

describe('calibrateEntry', () => {
  const map = buildThemeColorMap();
  const entry: CalibrationEntry = { name: 'blocks', dir: '/nowhere', expected: EXPECTED, snapshot: SNAPSHOT };

  it('checks every stated signal of every cell against recognition over the snapshot, offline', () => {
    const result = calibrateEntry(entry, SPRITES, map);
    expect(result).toMatchObject({ name: 'blocks', kind: 'checked', colorMode: 'light' });
    if (result.kind !== 'checked') throw new Error('unreachable');
    expect(result.cells.map((cell) => [ cell.nodeId, cell.checks.map((check) => `${ check.signal } ${ check.hit ? 'hit' : 'MISS' }`) ])).toEqual([
      [ '1:10', [ 'shape hit', 'color hit' ] ],
      [ '1:11', [ 'icon hit', 'color hit' ] ],
      [ '1:21', [ 'shape hit', 'composite hit' ] ],
      [ '1:22', [ 'icon hit', 'composite hit' ] ],
      [ '1:24', [ 'shape hit', 'composite hit' ] ],
    ]);
    expect(hasMiss([ result ])).toBe(false);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('reports a deliberate miss per signal with what was expected and what recognition said', () => {
    const cells: Expected['cells'] = {
      '1:10': { component: 'BlockEntity', props: {}, shape: 'amount', color: { text: 'text.secondary' } },
      '1:11': { component: 'BlockEntity', props: {}, icon: 'copy_check' },
      '1:21': { component: 'AddressFromTo', props: {}, status: 'ambiguous' },
      '1:22': { component: 'AddressFromTo', props: {}, composite: 'amount-ticker' },
    };
    const result = calibrateEntry({ ...entry, expected: { ...EXPECTED, cells } }, SPRITES, map);
    if (result.kind !== 'checked') throw new Error('unreachable');
    expect(result.cells.flatMap((cell) => cell.checks)).toEqual([
      { signal: 'shape', expected: 'amount, recognized', actual: 'number, recognized', hit: false },
      { signal: 'color', expected: 'text text.secondary', actual: 'text link.primary', hit: false },
      { signal: 'icon', expected: 'copy_check, recognized', actual: 'copy, recognized', hit: false },
      { signal: 'shape', expected: 'any, ambiguous', actual: 'truncated-hash, recognized', hit: false },
      { signal: 'composite', expected: 'amount-ticker', actual: 'from-to', hit: false },
    ]);
    expect(hasMiss([ result ])).toBe(true);
  });

  it('skips a stale entry and flags one without a snapshot', () => {
    expect(calibrateEntry({ ...entry, expected: { ...EXPECTED, stale: true } }, SPRITES, map)).toEqual({ name: 'blocks', kind: 'stale' });
    expect(calibrateEntry({ ...entry, snapshot: undefined }, SPRITES, map)).toEqual({ name: 'blocks', kind: 'no-snapshot' });
    expect(hasMiss([ { name: 'blocks', kind: 'stale' } ])).toBe(false);
    expect(hasMiss([ { name: 'blocks', kind: 'no-snapshot' } ])).toBe(true);
  });
});

describe('renderCalibration', () => {
  it('prints one line per entry, the misses under it, the per-signal table and the verdict', () => {
    const map = buildThemeColorMap();
    const missing: Expected['cells'] = { '1:10': { component: 'BlockEntity', props: { noIcon: true }, shape: 'amount' } };
    const results = calibrateSet([
      { name: 'blocks', dir: '/a', expected: EXPECTED, snapshot: SNAPSHOT },
      { name: 'miss', dir: '/b', expected: { ...EXPECTED, cells: missing }, snapshot: SNAPSHOT },
      { name: 'gone', dir: '/c', expected: { ...EXPECTED, stale: true }, snapshot: SNAPSHOT },
    ], SPRITES, map);
    expect(renderCalibration(results)).toBe([
      'Calibration: 3 entries, 2 checked, 1 stale',
      '  blocks (light): 5 cells, 10 checks, 0 misses',
      '  miss (light): 1 cells, 1 checks, 1 misses',
      '    MISS 1:10 BlockEntity shape: expected amount, recognized; got number, recognized',
      '  gone: stale, skipped (the node is gone from Figma; --refresh gone when it is back)',
      '',
      'signal     hits  misses',
      'shape         3       1',
      'icon          2       0',
      'color         2       0',
      'composite     3       0',
      '',
      'FAIL: 1 misses',
    ].join('\n'));
    expect(renderCalibration(results.slice(0, 1))).toMatch(/\nPASS: 10 checks$/);
  });
});

describe('refreshEntry', () => {
  const now = new Date('2026-10-08T12:00:00.000Z');
  const env = { [TOKEN_ENV]: 'personal-token' };
  const fetchWithToken = (ref: { fileKey: string; nodeId: string }): Promise<NodesResponse> => fetchNodes(ref, env);

  function payload(): NodesResponse {
    return {
      name: 'Pages',
      lastModified: '2026-10-07T00:00:00Z',
      version: '43',
      nodes: {
        '1:2': {
          document: {
            id: '1:2',
            name: 'Row',
            type: 'FRAME',
            absoluteBoundingBox: { x: 0, y: 0, width: 400, height: 20 },
            fills: [ { type: 'SOLID', color: { r: 1, g: 1, b: 1, a: 1 } } ],
            children: [
              { id: '1:10', name: 'number', type: 'TEXT', characters: '1248140', fills: [ { type: 'SOLID', color: { r: 0, g: 0, b: 0, a: 1 } } ] },
              { id: '1:11', name: 'copy', type: 'INSTANCE', fills: [ { type: 'SOLID', color: { r: 0, g: 0, b: 0, a: 1 } } ] },
            ],
          },
        },
      },
    };
  }

  it('re-extracts the node and overwrites the snapshot, clearing a stale mark', async() => {
    const dir = writeEntry('blocks', { ...EXPECTED, stale: true, cells: { '1:10': { component: 'BlockEntity', props: {} } } }, SNAPSHOT);
    fetchMock.mockResponseOnce(JSON.stringify(payload()));
    const outcome = await refreshEntry(loadEntry(dir), fetchWithToken, now, buildThemeColorMap());
    expect(outcome).toEqual({ name: 'blocks', kind: 'refreshed', leaves: 3 });
    expect(fetchMock.mock.calls[0][0]).toBe('https://api.figma.com/v1/files/abcDEF0123456789abcDEF/nodes?ids=1%3A2');
    const snapshot = readJson(path.join(dir, SNAPSHOT_FILE)) as Snapshot;
    expect(snapshot).toMatchObject({
      version: SNAPSHOT_VERSION,
      fileKey: 'abcDEF0123456789abcDEF',
      nodeId: '1:2',
      capturedAt: '2026-10-08T12:00:00.000Z',
      file: { lastModified: '2026-10-07T00:00:00Z', version: '43' },
      regions: [ '1:2' ],
      frameBackground: { hex: '#FFFFFF', alpha: 1 },
    });
    expect(snapshot.leaves.map((leaf) => leaf.id)).toEqual([ '1:2', '1:10', '1:11' ]);
    expect(readJson(path.join(dir, EXPECTED_FILE))).toMatchObject({ stale: false, cells: { '1:10': { component: 'BlockEntity' } } });
    expect(loadEntry(dir).snapshot).toEqual(snapshot);
  });

  it('marks the entry stale and keeps the old snapshot when the node is gone from the file or Figma answers 404', async() => {
    const dir = writeEntry('blocks', EXPECTED, SNAPSHOT);
    fetchMock.mockResponseOnce(JSON.stringify({ ...payload(), nodes: { '1:2': null } }));
    expect(await refreshEntry(loadEntry(dir), fetchWithToken, now)).toEqual({ name: 'blocks', kind: 'stale', reason: 'node 1:2 is not in file "Pages"' });
    expect(readJson(path.join(dir, EXPECTED_FILE))).toMatchObject({ stale: true });
    expect(readJson(path.join(dir, SNAPSHOT_FILE))).toEqual(SNAPSHOT);

    fetchMock.mockResponseOnce('', { status: 404 });
    expect(await refreshEntry(loadEntry(dir), fetchWithToken, now)).toMatchObject({ kind: 'stale', reason: /Figma returned 404/ });
  });

  it('stops on a rejected token or a missing one, touching nothing', async() => {
    const dir = writeEntry('blocks', EXPECTED, SNAPSHOT);
    fetchMock.mockResponseOnce('', { status: 403 });
    await expect(refreshEntry(loadEntry(dir), fetchWithToken, now)).rejects.toThrow(FigmaFetchError);
    await expect(refreshEntry(loadEntry(dir), (ref) => fetchNodes(ref, {}), now)).rejects.toThrow('No Figma token');
    expect(readJson(path.join(dir, EXPECTED_FILE))).toEqual(EXPECTED);
  });

  it('honours the entry\'s own regions over the outline\'s content root', async() => {
    const dir = writeEntry('blocks', { ...EXPECTED, regions: [ '1:11' ], cells: {} }, undefined);
    fetchMock.mockResponseOnce(JSON.stringify(payload()));
    expect(await refreshEntry(loadEntry(dir), fetchWithToken, now)).toEqual({ name: 'blocks', kind: 'refreshed', leaves: 1 });
    expect((readJson(path.join(dir, SNAPSHOT_FILE)) as Snapshot).regions).toEqual([ '1:11' ]);
  });
});

describe('the committed calibration set', () => {
  it('loads, and every expected cell holds over its snapshot', () => {
    const results = calibrateSet(loadCalibration(calibrationDir(path.join(__dirname, '..', '..', '..'))), loadSpriteNames());
    expect(results.length).toBeGreaterThanOrEqual(10);
    expect(renderCalibration(results)).toMatch(/\nPASS: \d+ checks$/);
    expect(hasMiss(results)).toBe(false);
  });
});
