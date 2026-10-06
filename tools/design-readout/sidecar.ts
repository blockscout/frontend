import fs from 'fs';
import path from 'path';

import type { ColorMode } from './colormap';
import { SIDECAR_DIR } from './config';
import type { BoundingBox } from './figma';
import type { Leaf, LeafValues } from './values';

export const SIDECAR_VERSION = 1;

// Per node: the values and box this run extracted, plus the slots later phases fill — the decision
// (component, props, tokens, the signal that fired), its status, and the developer's correction. A
// `null` slot is one nothing has filled yet.
export interface NodeRecord {
  readonly id: string;
  readonly values: LeafValues;
  readonly bbox: BoundingBox | null;
  readonly decision: null;
  readonly status: null;
  readonly correction: null;
}

export interface SidecarRecord {
  readonly version: number;
  readonly createdAt: string;
  readonly fileKey: string;
  readonly nodeId: string;
  readonly file: {
    readonly lastModified: string;
    readonly version: string;
  };
  readonly colorMode: ColorMode | null;
  readonly regions: ReadonlyArray<string>;
  readonly nodes: ReadonlyArray<NodeRecord>;
}

export interface SidecarInputs {
  readonly createdAt: string;
  readonly fileKey: string;
  readonly nodeId: string;
  readonly lastModified: string;
  readonly fileVersion: string;
  readonly regions: ReadonlyArray<string>;
  readonly leaves: ReadonlyArray<Leaf>;
}

export function buildRecord(inputs: SidecarInputs): SidecarRecord {
  return {
    version: SIDECAR_VERSION,
    createdAt: inputs.createdAt,
    fileKey: inputs.fileKey,
    nodeId: inputs.nodeId,
    file: { lastModified: inputs.lastModified, version: inputs.fileVersion },
    colorMode: null,
    regions: inputs.regions,
    nodes: inputs.leaves.map((leaf) => ({ id: leaf.id, values: leaf.values, bbox: leaf.bbox, decision: null, status: null, correction: null })),
  };
}

export function sidecarPath(mainCheckout: string, fileKey: string, nodeId: string): string {
  return path.join(mainCheckout, SIDECAR_DIR, `${ fileKey }-${ nodeId.replace(':', '-') }.json`);
}

export function writeSidecar(filePath: string, record: SidecarRecord): void {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${ JSON.stringify(record, null, 2) }\n`);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

export function readSidecar(filePath: string): SidecarRecord {
  const parsed: unknown = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  if (!isRecord(parsed) || parsed.version !== SIDECAR_VERSION) throw new Error(`Not a design-readout sidecar (version ${ SIDECAR_VERSION }): ${ filePath }`);
  // Only this tool writes the folder; the version is the one field an edited file could drift on.
  return parsed as unknown as SidecarRecord;
}
