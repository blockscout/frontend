import fs from 'fs';
import os from 'os';
import path from 'path';

import { afterEach, describe, expect, it } from 'vitest';

import { buildRecord, readSidecar, sidecarPath, writeSidecar } from './sidecar';
import type { Leaf } from './values';

let tmp = '';

afterEach(() => {
  if (tmp) fs.rmSync(tmp, { recursive: true, force: true });
  tmp = '';
});

const LEAVES: ReadonlyArray<Leaf> = [
  {
    id: '1:2',
    bbox: { x: 1, y: 2, width: 3, height: 4 },
    values: {
      kind: 'text',
      text: 'Hi',
      trailingGlyphs: undefined,
      font: { family: 'Inter', weight: 500, size: 14, lineHeight: 20 },
      colors: [ { role: 'text', hex: '#FFFFFF', alpha: 0.8 } ],
    },
  },
  { id: '1:3', bbox: null, values: { kind: 'icon', icon: 'Icons/x', colors: [] } },
];

function record(): ReturnType<typeof buildRecord> {
  return buildRecord({
    createdAt: '2026-10-06T10:00:00.000Z',
    fileKey: 'KEY',
    nodeId: '22842:178383',
    lastModified: '2026-10-01T00:00:00Z',
    fileVersion: '42',
    regions: [ '22842:178383' ],
    leaves: LEAVES,
  });
}

describe('sidecarPath', () => {
  it('is one file per file key and node under the main checkout, with a file-safe node id', () => {
    expect(sidecarPath('/repo', 'KEY', '22842:178383')).toBe(path.join('/repo', '.ai', 'design-readout', 'KEY-22842-178383.json'));
  });
});

describe('buildRecord', () => {
  it('carries the file identity, an empty color mode slot and one node per leaf with empty decision slots', () => {
    expect(record()).toEqual({
      version: 1,
      createdAt: '2026-10-06T10:00:00.000Z',
      fileKey: 'KEY',
      nodeId: '22842:178383',
      file: { lastModified: '2026-10-01T00:00:00Z', version: '42' },
      colorMode: null,
      regions: [ '22842:178383' ],
      nodes: [
        { id: '1:2', values: LEAVES[0].values, bbox: { x: 1, y: 2, width: 3, height: 4 }, decision: null, status: null, correction: null },
        { id: '1:3', values: LEAVES[1].values, bbox: null, decision: null, status: null, correction: null },
      ],
    });
  });

  it('stores no Figma hint, style name, component name or layer name', () => {
    const built = record();
    expect(Object.keys(built).sort()).toEqual([ 'colorMode', 'createdAt', 'file', 'fileKey', 'nodeId', 'nodes', 'regions', 'version' ]);
    for (const node of built.nodes) {
      expect(Object.keys(node).sort()).toEqual([ 'bbox', 'correction', 'decision', 'id', 'status', 'values' ]);
    }
    expect(JSON.stringify(built)).not.toMatch(/hint|style|component|layer|name/i);
  });
});

describe('writeSidecar / readSidecar', () => {
  it('writes pretty JSON, creating the folder, and reads the same record back', () => {
    tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'design-readout-sidecar-'));
    const target = sidecarPath(tmp, 'KEY', '22842:178383');
    writeSidecar(target, record());
    expect(fs.readFileSync(target, 'utf8')).toMatch(/^\{\n {2}"version": 1,\n/);
    expect(readSidecar(target)).toEqual(record());
  });

  it('rejects a file that is not a sidecar of the current version', () => {
    tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'design-readout-sidecar-'));
    const target = path.join(tmp, 'x.json');
    fs.writeFileSync(target, JSON.stringify({ version: 99 }));
    expect(() => readSidecar(target)).toThrow('Not a design-readout sidecar (version 1)');
    fs.writeFileSync(target, JSON.stringify(null));
    expect(() => readSidecar(target)).toThrow('Not a design-readout sidecar');
  });
});
