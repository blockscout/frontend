import fs from 'fs';
import os from 'os';
import path from 'path';

import { afterEach, describe, expect, it } from 'vitest';

import type { Recognition } from './recognize';
import { applyCorrection, buildRecord, isGapCategory, readSidecar, sidecarPath, writeSidecar } from './sidecar';
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

const TOKENS: Recognition['tokens'] = [ { role: 'text', color: '#FFFFFF/80', tokens: [ 'text.primary' ] } ];
const COMPOSITE: Recognition['composite'] = { signal: 'from-to', part: 'arrow', members: { from: '1:1', arrow: '1:3', to: '1:4' } };

const RECOGNITIONS: ReadonlyArray<Recognition> = [
  { id: '1:2', status: 'unrecognized', decision: null, tokens: TOKENS, composite: null },
  { id: '1:3', status: 'recognized', decision: { signal: 'icon', icon: 'x' }, tokens: [], composite: COMPOSITE },
];

function record(): ReturnType<typeof buildRecord> {
  return buildRecord({
    createdAt: '2026-10-06T10:00:00.000Z',
    fileKey: 'KEY',
    nodeId: '22842:178383',
    lastModified: '2026-10-01T00:00:00Z',
    fileVersion: '42',
    colorMode: 'dark',
    regions: [ '22842:178383' ],
    leaves: LEAVES,
    recognitions: RECOGNITIONS,
  });
}

describe('sidecarPath', () => {
  it('is one file per file key and node under the main checkout, with a file-safe node id', () => {
    expect(sidecarPath('/repo', 'KEY', '22842:178383')).toBe(path.join('/repo', '.ai', 'design-readout', 'KEY-22842-178383.json'));
  });
});

describe('buildRecord', () => {
  it('carries the file identity, the color mode and one node per leaf with its status, decision, tokens, composite and an empty correction', () => {
    expect(record()).toEqual({
      version: 2,
      createdAt: '2026-10-06T10:00:00.000Z',
      fileKey: 'KEY',
      nodeId: '22842:178383',
      file: { lastModified: '2026-10-01T00:00:00Z', version: '42' },
      colorMode: 'dark',
      regions: [ '22842:178383' ],
      nodes: [
        {
          id: '1:2',
          values: LEAVES[0].values,
          bbox: { x: 1, y: 2, width: 3, height: 4 },
          decision: null,
          status: 'unrecognized',
          tokens: TOKENS,
          composite: null,
          correction: null,
        },
        {
          id: '1:3',
          values: LEAVES[1].values,
          bbox: null,
          decision: { signal: 'icon', icon: 'x' },
          status: 'recognized',
          tokens: [],
          composite: COMPOSITE,
          correction: null,
        },
      ],
    });
  });

  it('fails on a leaf with no recognition rather than writing a half-filled record', () => {
    expect(() => buildRecord({
      createdAt: '2026-10-06T10:00:00.000Z',
      fileKey: 'KEY',
      nodeId: '22842:178383',
      lastModified: '2026-10-01T00:00:00Z',
      fileVersion: '42',
      colorMode: 'dark',
      regions: [ '22842:178383' ],
      leaves: LEAVES,
      recognitions: RECOGNITIONS.slice(0, 1),
    })).toThrow('Leaf 1:3 has no recognition.');
  });

  it('stores no Figma hint, style name, component name or layer name', () => {
    const built = record();
    expect(Object.keys(built).sort()).toEqual([ 'colorMode', 'createdAt', 'file', 'fileKey', 'nodeId', 'nodes', 'regions', 'version' ]);
    for (const node of built.nodes) {
      expect(Object.keys(node).sort()).toEqual([ 'bbox', 'composite', 'correction', 'decision', 'id', 'status', 'tokens', 'values' ]);
    }
    expect(JSON.stringify(built)).not.toMatch(/hint|style|component|layer|name/i);
  });
});

describe('isGapCategory', () => {
  it('accepts exactly the six categories', () => {
    for (const category of [ 'shape', 'icon', 'color', 'composite', 'context', 'layout' ]) expect(isGapCategory(category)).toBe(true);
    expect(isGapCategory('Shape')).toBe(false);
    expect(isGapCategory('typo')).toBe(false);
  });
});

describe('applyCorrection', () => {
  const correction = { component: 'IconSvg', props: [ 'name=x' ], gap: 'icon' as const, recordedAt: '2026-10-07T09:30:00.000Z', stale: false };

  it('sets the correction on the named node and leaves the rest of the record alone', () => {
    const corrected = applyCorrection(record(), '1:3', correction);
    expect(corrected.nodes[1]).toEqual({ ...record().nodes[1], correction });
    expect({ ...corrected, nodes: undefined }).toEqual({ ...record(), nodes: undefined });
    expect(corrected.nodes[0]).toEqual(record().nodes[0]);
  });

  it('replaces an earlier correction on the same node', () => {
    const twice = applyCorrection(applyCorrection(record(), '1:3', { ...correction, stale: true }), '1:3', correction);
    expect(twice.nodes[1].correction).toEqual(correction);
  });

  it('rejects a node that is not in the record, naming the ones that are', () => {
    expect(() => applyCorrection(record(), '9:9', correction)).toThrow('Node 9:9 is not in the sidecar of 22842:178383; its nodes are 1:2, 1:3.');
  });
});

describe('writeSidecar / readSidecar', () => {
  it('writes pretty JSON, creating the folder, and reads the same record back', () => {
    tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'design-readout-sidecar-'));
    const target = sidecarPath(tmp, 'KEY', '22842:178383');
    writeSidecar(target, record());
    expect(fs.readFileSync(target, 'utf8')).toMatch(/^\{\n {2}"version": 2,\n/);
    expect(readSidecar(target)).toEqual(record());
  });

  it('rejects a file that is not a sidecar of the current version', () => {
    tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'design-readout-sidecar-'));
    const target = path.join(tmp, 'x.json');
    fs.writeFileSync(target, JSON.stringify({ version: 99 }));
    expect(() => readSidecar(target)).toThrow('Not a design-readout sidecar (version 2)');
    fs.writeFileSync(target, JSON.stringify(null));
    expect(() => readSidecar(target)).toThrow('Not a design-readout sidecar');
  });
});
