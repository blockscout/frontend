/* eslint-disable no-console -- this is a CLI whose entire job is to print an outline to stdout */
import fs from 'fs';
import path from 'path';

import { resolveCheckoutRoot, resolveMainCheckout } from '../../cli/checkout';
import type { CalibrationEntry } from '../calibration';
import { calibrateSet, calibrationDir, describeRefresh, hasMiss, loadCalibration, refreshEntry, renderCalibration } from '../calibration';
import { OVERRIDE_COLOR_PROPS } from '../config';
import { describeNode, renderOutline, scopeOutline, summarize } from '../extract/scope';
import { extractRegions, renderExtraction } from '../extract/values';
import type { Extraction } from '../extract/values';
import type { FigmaNode, NodeEntry, NodesResponse } from '../fetch/figma';
import { entryOf, fetchNodes } from '../fetch/figma';
import type { NodeRef } from '../fetch/url';
import { buildThemeColorMap } from '../recognize/colormap';
import type { ColorTokens, Recognition } from '../recognize/signals';
import { loadSpriteNames, recognize, renderRecognition } from '../recognize/signals';
import type { GapAppend } from '../record/gaps';
import { appendGap, gapLogPath, gapOfCorrection, gapOfNote } from '../record/gaps';
import { carryCorrections, diffRecords, renderRerun } from '../record/rerun';
import type { Correction, NodeRecord, Override, SidecarRecord } from '../record/sidecar';
import { applyCorrection, applyOverride, buildRecord, readSidecar, sidecarPath, writeSidecar } from '../record/sidecar';
import type { CliOptions, CorrectionRequest, NoteRequest, OverrideRequest } from './args';

function renderHeader(payload: NodesResponse, root: FigmaNode): string {
  return [
    `File: ${ payload.name } — version ${ payload.version }, last modified ${ payload.lastModified }`,
    `Node: ${ describeNode(summarize(root)) }`,
  ].join('\n');
}

export function dumpPayload(target: string, payload: NodesResponse, cwd: string): string {
  const file = path.resolve(cwd, target);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(payload, null, 2) + '\n');
  return file;
}

export interface Readout {
  readonly regions: ReadonlyArray<string>;
  readonly extraction: Extraction;
  readonly recognitions: ReadonlyArray<Recognition>;
}

export function readoutOf(entry: NodeEntry, regionIds: ReadonlyArray<string> | undefined, spriteNames: ReadonlyArray<string>): Readout {
  const map = buildThemeColorMap();
  const { regions, extraction } = extractRegions(entry, regionIds, map);
  return { regions, extraction, recognitions: recognize(extraction.leaves, spriteNames, map, extraction.colorMode.mode) };
}

type OverrideColorProp = keyof typeof OVERRIDE_COLOR_PROPS;

function isOverrideColorProp(prop: string): prop is OverrideColorProp {
  return Object.hasOwn(OVERRIDE_COLOR_PROPS, prop);
}

function describeResolved(role: string, fills: ReadonlyArray<ColorTokens>): string {
  if (fills.length === 0) return `no ${ role } fill`;
  const resolved = fills.flatMap((tokens) => tokens.tokens);
  if (resolved.length === 0) return `no token for its ${ role } fill ${ fills.map((fill) => fill.color).join(', ') }`;
  return `${ role } tokens ${ resolved.join(', ') }`;
}

// The check reads the node's recorded tokens and nothing else: no theme lookup, so it is offline
// and the match is against what the Recognized list printed for that fill.
function checkColorProp(node: NodeRecord, prop: OverrideColorProp, value: string): void {
  const role = OVERRIDE_COLOR_PROPS[prop];
  const fills = node.tokens.filter((tokens) => tokens.role === role);
  const resolved = fills.flatMap((tokens) => tokens.tokens);
  if (resolved.includes(value)) return;
  throw new Error(`${ prop }=${ value } names a token the mockup does not draw on ${ node.id }: the node resolved ${ describeResolved(role, fills) }.`);
}

function sidecarTarget(mainCheckout: string, ref: NodeRef): string {
  const target = sidecarPath(mainCheckout, ref.fileKey, ref.nodeId);
  if (!fs.existsSync(target)) throw new Error(`No sidecar for node ${ ref.nodeId }: run the readout first; it writes ${ target }.`);
  return target;
}

// Offline like a correction, and unlike one it touches the gap log not at all: the tool read the
// values right, the disagreement is design intent.
export function recordOverride(mainCheckout: string, ref: NodeRef, request: OverrideRequest, now: Date): SidecarRecord {
  const target = sidecarTarget(mainCheckout, ref);
  const previous = readSidecar(target);
  const node = previous.nodes.find((candidate) => candidate.id === request.nodeId);
  if (node !== undefined) {
    for (const word of request.props) {
      const [ prop, value ] = word.split('=', 2);
      if (isOverrideColorProp(prop)) checkColorProp(node, prop, value);
    }
  }
  const override: Override = { props: request.props, recordedAt: now.toISOString(), stale: false };
  const record = applyOverride(previous, request.nodeId, override);
  writeSidecar(target, record);
  return record;
}

export function runOverride(ref: NodeRef, request: OverrideRequest): void {
  const mainCheckout = resolveMainCheckout(process.cwd());
  recordOverride(mainCheckout, ref, request, new Date());
  console.log(`Override recorded for ${ request.nodeId } in ${ sidecarPath(mainCheckout, ref.fileKey, ref.nodeId) }: ${ request.props.join(' ') }`);
  console.log('No gap logged: an override is design intent, not a miss.');
}

export interface CorrectionOutcome {
  readonly record: SidecarRecord;
  readonly gap: GapAppend;
}

// Offline on purpose: the correction is about the sidecar the developer just read, so a fetch would
// only risk writing a correction against values they have not seen.
export function recordCorrection(mainCheckout: string, ref: NodeRef, request: CorrectionRequest, now: Date): CorrectionOutcome {
  const target = sidecarTarget(mainCheckout, ref);
  const recordedAt = now.toISOString();
  const correction: Correction = { component: request.component, props: request.props, gap: request.gap, recordedAt, stale: false };
  const record = applyCorrection(readSidecar(target), request.nodeId, correction);
  writeSidecar(target, record);
  const node = record.nodes.find((candidate) => candidate.id === request.nodeId);
  if (node === undefined) throw new Error(`Node ${ request.nodeId } vanished from the sidecar while correcting it.`);
  const entry = gapOfCorrection({ date: recordedAt.split('T')[0], fileKey: ref.fileKey, nodeId: request.nodeId, correction, node });
  return { record, gap: appendGap(gapLogPath(mainCheckout), entry) };
}

function printGap(mainCheckout: string, gap: GapAppend): void {
  console.log(gap.appended ? `Gap logged in ${ gapLogPath(mainCheckout) }:` : `Same miss already in ${ gapLogPath(mainCheckout) }, no line added:`);
  console.log(gap.line);
}

export function runCorrection(ref: NodeRef, request: CorrectionRequest): void {
  const mainCheckout = resolveMainCheckout(process.cwd());
  const { gap } = recordCorrection(mainCheckout, ref, request, new Date());
  console.log(`Correction recorded for ${ request.nodeId } in ${ sidecarPath(mainCheckout, ref.fileKey, ref.nodeId) }`);
  printGap(mainCheckout, gap);
}

// The URL is read for its file key and nothing else: a note needs no sidecar, so it works before a
// readout was ever run on the node.
export function recordNote(mainCheckout: string, ref: NodeRef, request: NoteRequest, now: Date): GapAppend {
  const date = now.toISOString().split('T')[0];
  return appendGap(gapLogPath(mainCheckout), gapOfNote({ date, fileKey: ref.fileKey, gap: request.gap, text: request.text }));
}

export function runNote(ref: NodeRef, request: NoteRequest): void {
  const mainCheckout = resolveMainCheckout(process.cwd());
  printGap(mainCheckout, recordNote(mainCheckout, ref, request, new Date()));
}

export async function runReadout(ref: NodeRef, options: CliOptions): Promise<void> {
  const payload = await fetchNodes(ref);
  if (options.dump !== undefined) console.log(`Raw payload written to ${ dumpPayload(options.dump, payload, process.cwd()) }`);
  const entry = entryOf(payload, ref.nodeId);
  console.log(renderHeader(payload, entry.document));
  console.log('');
  console.log(renderOutline(scopeOutline(entry.document)));
  console.log('');
  const { regions, extraction, recognitions } = readoutOf(entry, options.regions, loadSpriteNames());
  console.log(`Regions: ${ regions.join(', ') }`);
  const target = sidecarPath(resolveMainCheckout(process.cwd()), ref.fileKey, ref.nodeId);
  const record = buildRecord({
    createdAt: new Date().toISOString(),
    fileKey: ref.fileKey,
    nodeId: ref.nodeId,
    lastModified: payload.lastModified,
    fileVersion: payload.version,
    colorMode: extraction.colorMode.mode,
    regions,
    leaves: extraction.leaves,
    recognitions,
  });
  const previous = fs.existsSync(target) ? readSidecar(target) : undefined;
  if (previous === undefined) {
    console.log(renderExtraction(extraction));
    writeSidecar(target, record);
    console.log('');
    console.log(`Sidecar written to ${ target }`);
    console.log('');
    console.log(renderRecognition(extraction.leaves, recognitions));
    return;
  }
  const merged = carryCorrections(previous, record);
  writeSidecar(target, merged);
  console.log('');
  console.log(`Sidecar updated at ${ target }`);
  console.log('');
  console.log(renderRerun(diffRecords(previous, merged)));
}

export function runCalibrate(): void {
  const results = calibrateSet(loadCalibration(calibrationDir(resolveCheckoutRoot(process.cwd()))), loadSpriteNames());
  console.log(renderCalibration(results));
  if (hasMiss(results)) process.exitCode = 1;
}

function selectEntries(entries: ReadonlyArray<CalibrationEntry>, name: string | undefined): ReadonlyArray<CalibrationEntry> {
  if (name === undefined) return entries;
  const entry = entries.find((candidate) => candidate.name === name);
  if (entry === undefined) throw new Error(`No calibration entry named ${ name }; the entries are ${ entries.map((candidate) => candidate.name).join(', ') }.`);
  return [ entry ];
}

export async function runRefresh(name: string | undefined): Promise<void> {
  const entries = selectEntries(loadCalibration(calibrationDir(resolveCheckoutRoot(process.cwd()))), name);
  const map = buildThemeColorMap();
  console.log(`Refreshing ${ entries.length } calibration ${ entries.length === 1 ? 'entry' : 'entries' }:`);
  for (const entry of entries) {
    console.log(describeRefresh(await refreshEntry(entry, fetchNodes, new Date(), map)));
  }
}
