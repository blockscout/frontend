import fs from 'fs';
import path from 'path';

import { GAP_CATEGORIES, SIDECAR_DIR } from '../config';
import type { Leaf, LeafValues } from '../extract/values';
import type { BoundingBox } from '../fetch/figma';
import { fileSafeNodeId } from '../fetch/url';
import type { ColorMode } from '../recognize/colormap';
import type { ColorTokens, CompositeMembership, Decision, Recognition, RecognitionStatus } from '../recognize/signals';

export const SIDECAR_VERSION = 2;

export type GapCategory = typeof GAP_CATEGORIES[number];

// What the developer said a node is, against what the tool said: the repo component, its props as
// given, and the kind of miss. `stale` is set by a re-run whose values for the node differ from the
// ones the correction was given on; the correction stays until the developer re-confirms it.
export interface Correction {
  readonly component: string;
  readonly props: ReadonlyArray<string>;
  readonly gap: GapCategory;
  readonly recordedAt: string;
  readonly stale: boolean;
}

// What the mockup styles on purpose, on a node whose component the tool read right: Chakra props as
// `<prop>=<value>` words, over the shipped component's own. Not a miss: it names no component and logs
// no gap. `stale` follows the correction's rule — set by a re-run whose values differ.
export interface Override {
  readonly props: ReadonlyArray<string>;
  readonly recordedAt: string;
  readonly stale: boolean;
}

// Per node: the values and box this run extracted, what recognition decided (the signal that fired
// and what it says the node is; `null` when nothing fired) with its status, the tokens each fill
// resolved to in the run's mode, the composite the node is part of (`null` when none fired), and
// the slots for the developer's correction and style override, each `null` until given.
export interface NodeRecord {
  readonly id: string;
  readonly values: LeafValues;
  readonly bbox: BoundingBox | null;
  readonly decision: Decision | null;
  readonly status: RecognitionStatus;
  readonly tokens: ReadonlyArray<ColorTokens>;
  readonly composite: CompositeMembership | null;
  readonly correction: Correction | null;
  readonly override: Override | null;
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
  readonly colorMode: ColorMode;
  readonly regions: ReadonlyArray<string>;
  readonly nodes: ReadonlyArray<NodeRecord>;
}

export interface SidecarInputs {
  readonly createdAt: string;
  readonly fileKey: string;
  readonly nodeId: string;
  readonly lastModified: string;
  readonly fileVersion: string;
  readonly colorMode: ColorMode;
  readonly regions: ReadonlyArray<string>;
  readonly leaves: ReadonlyArray<Leaf>;
  readonly recognitions: ReadonlyArray<Recognition>;
}

function nodeRecordOf(leaf: Leaf, recognitions: ReadonlyMap<string, Recognition>): NodeRecord {
  const recognition = recognitions.get(leaf.id);
  if (recognition === undefined) throw new Error(`Leaf ${ leaf.id } has no recognition.`);
  const { decision, status, tokens, composite } = recognition;
  return { id: leaf.id, values: leaf.values, bbox: leaf.bbox, decision, status, tokens, composite, correction: null, override: null };
}

export function buildRecord(inputs: SidecarInputs): SidecarRecord {
  const recognitions = new Map(inputs.recognitions.map((recognition) => [ recognition.id, recognition ]));
  return {
    version: SIDECAR_VERSION,
    createdAt: inputs.createdAt,
    fileKey: inputs.fileKey,
    nodeId: inputs.nodeId,
    file: { lastModified: inputs.lastModified, version: inputs.fileVersion },
    colorMode: inputs.colorMode,
    regions: inputs.regions,
    nodes: inputs.leaves.map((leaf) => nodeRecordOf(leaf, recognitions)),
  };
}

export function isGapCategory(value: string): value is GapCategory {
  return (GAP_CATEGORIES as ReadonlyArray<string>).includes(value);
}

function assertNode(record: SidecarRecord, nodeId: string): void {
  if (!record.nodes.some((node) => node.id === nodeId)) {
    throw new Error(`Node ${ nodeId } is not in the sidecar of ${ record.nodeId }; its nodes are ${ record.nodes.map((node) => node.id).join(', ') }.`);
  }
}

export function applyCorrection(record: SidecarRecord, nodeId: string, correction: Correction): SidecarRecord {
  assertNode(record, nodeId);
  return { ...record, nodes: record.nodes.map((node) => node.id === nodeId ? { ...node, correction } : node) };
}

// Replaces the node's override whole, as `applyCorrection` does; the correction slot is untouched.
export function applyOverride(record: SidecarRecord, nodeId: string, override: Override): SidecarRecord {
  assertNode(record, nodeId);
  return { ...record, nodes: record.nodes.map((node) => node.id === nodeId ? { ...node, override } : node) };
}

export function sidecarPath(mainCheckout: string, fileKey: string, nodeId: string): string {
  return path.join(mainCheckout, SIDECAR_DIR, `${ fileKey }-${ fileSafeNodeId(nodeId) }.json`);
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
  // Only this tool writes the folder; the version is the one field an edited file could drift on. The
  // override slot came after version 2 was cut, so a record written before it reads back with `null`.
  const record = parsed as unknown as SidecarRecord;
  return { ...record, nodes: record.nodes.map((node) => ({ ...node, override: node.override ?? null })) };
}
