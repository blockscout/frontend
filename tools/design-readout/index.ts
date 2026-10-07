/* eslint-disable no-console -- this is a CLI whose entire job is to print an outline to stdout */
import fs from 'fs';
import path from 'path';

import { resolveMainCheckout } from '../cli/checkout';
import type { FlagSpec } from '../cli/flags';
import { parseArgs as parseFlags } from '../cli/flags';
import { buildThemeColorMap } from './colormap';
import { GAP_CATEGORIES } from './config';
import type { FigmaNode, NodeEntry, NodesResponse } from './figma';
import { entryOf, FigmaFetchError, fetchNodes } from './figma';
import { appendGap, gapLogPath } from './gaps';
import type { Recognition } from './recognize';
import { loadSpriteNames, recognize, renderRecognition } from './recognize';
import { carryCorrections, diffRecords, renderRerun } from './rerun';
import { describeNode, renderOutline, scopeOutline, summarize } from './scope';
import type { Correction, GapCategory, SidecarRecord } from './sidecar';
import { applyCorrection, buildRecord, isGapCategory, readSidecar, sidecarPath, writeSidecar } from './sidecar';
import type { NodeRef } from './url';
import { parseNodeRef } from './url';
import type { Extraction } from './values';
import { extractValues, findNode, renderExtraction } from './values';

export interface CliOptions {
  dump: string | undefined;
  regions: ReadonlyArray<string> | undefined;
  correct: string | undefined;
  gap: GapCategory | undefined;
}

const USAGE = `Usage:
  design:readout <figma node URL> [--regions <ids>] [--dump <path>]
  design:readout <figma node URL> --correct <nodeId> <component> [<props…>] --gap <category>

  Reads the node through the Figma REST API and prints its scoping outline for you to confirm: the
  content root the tool descended to and the chrome dropped at each level with the rule that dropped
  it. One link is one screen: a hidden layer (visibility off) is not part of it and is ignored; a
  state or a mobile variant of the screen is its own node and its own link.

  Then it extracts the values of every leaf under the confirmed regions — text, fills per role, font,
  icon instance name, trailing glyphs, bounding box — prints them with the Figma style and component
  names as hints (flagged where a hint disagrees with the value), and writes the values to one JSON
  sidecar under the main checkout's .ai/design-readout/. Hints are printed only, never written.

  Last, it says what it recognizes per leaf — text shapes (hashes, numbers, amounts, timestamps,
  tickers, NFT ids) first, then icon instance names against the sprite, then every fill resolved to
  its theme tokens in the color mode the values voted for, then composites over recognized
  neighbours (hash, arrow, hash as from/to; amount and ticker) — and ends with the Recognized list
  with tokens and composites and the full Ambiguous and Unrecognized lists with their values; it
  names no component.

  A node that already has a sidecar is diffed against it instead: only the leaves whose values or
  decision changed are printed, plus new and vanished ones. A correction carries over to the new
  sidecar; where the node's values changed it is kept but flagged STALE for you to re-confirm.

  --correct records what a node really is, against what the tool said, and appends one line to the
  gap log beside the sidecars (.ai/design-readout/gaps.md). It works on the existing sidecar and
  needs no token. A correction is always a miss, so --gap is required with it.

  <figma node URL>     https://www.figma.com/design/<fileKey>/<name>?node-id=<A>-<B>
                       (the node id is accepted as A-B or A:B; the file key comes from the URL)
  --regions <ids>      the confirmed regions, comma-separated node ids (A-B or A:B); default: the
                       content root the outline names
  --dump <path>        also write the raw REST payload to this file, e.g. to capture a test fixture
  --correct <nodeId>   the leaf to correct, by node id (A-B or A:B), followed by the repo component
                       it is and any props, as words: --correct 22842-178386 BlockEntity noIcon
  --gap <category>     the kind of miss the correction fixes: ${ GAP_CATEGORIES.join(', ') }

  The run needs a Figma personal access token in the environment and fails without one; it never
  reads another source. Personal access tokens expire after at most 90 days, so a rejected token
  usually means a new one is due.`;

const NODE_ID = /^(\d+)[-:](\d+)$/;

function parseNodeId(raw: string, flag: string): string {
  const match = NODE_ID.exec(raw.trim());
  if (match === null) throw new Error(`Not a node id in ${ flag }: ${ raw.trim() }\n${ USAGE }`);
  return `${ match[1] }:${ match[2] }`;
}

function parseRegionIds(value: string): Array<string> {
  return value.split(',').map((raw) => parseNodeId(raw, '--regions'));
}

function parseGapCategory(value: string): GapCategory {
  if (!isGapCategory(value)) throw new Error(`Not a gap category: ${ value }; --gap takes one of ${ GAP_CATEGORIES.join(', ') }\n${ USAGE }`);
  return value;
}

const FLAGS: ReadonlyMap<string, FlagSpec<CliOptions>> = new Map<string, FlagSpec<CliOptions>>([
  [ '--help', { kind: 'switch', apply: () => {
    console.log(USAGE);
    process.exit(0);
  } } ],
  [ '-h', { kind: 'switch', apply: () => {
    console.log(USAGE);
    process.exit(0);
  } } ],
  [ '--dump', { kind: 'value', apply: (options, value) => {
    options.dump = value;
  } } ],
  [ '--regions', { kind: 'value', apply: (options, value) => {
    options.regions = parseRegionIds(value);
  } } ],
  [ '--correct', { kind: 'value', apply: (options, value) => {
    options.correct = parseNodeId(value, '--correct');
  } } ],
  [ '--gap', { kind: 'value', apply: (options, value) => {
    options.gap = parseGapCategory(value);
  } } ],
]);

export interface CorrectionRequest {
  readonly nodeId: string;
  readonly component: string;
  readonly props: ReadonlyArray<string>;
  readonly gap: GapCategory;
}

export interface ParsedCli {
  readonly options: CliOptions;
  readonly ref: NodeRef;
  readonly correction: CorrectionRequest | undefined;
}

const DEFAULT_OPTIONS: CliOptions = { dump: undefined, regions: undefined, correct: undefined, gap: undefined };

function parseCorrection(options: CliOptions, words: ReadonlyArray<string>): CorrectionRequest | undefined {
  if (options.correct === undefined) {
    if (options.gap !== undefined) throw new Error(`--gap goes with --correct; nothing to log without a correction\n${ USAGE }`);
    if (words.length > 0) throw new Error(`Unexpected argument: ${ words[0] }\n${ USAGE }`);
    return undefined;
  }
  if (words.length === 0) throw new Error(`--correct ${ options.correct } needs the component the node is, after the URL\n${ USAGE }`);
  if (options.gap === undefined) {
    throw new Error(`A correction is always a miss: --correct needs --gap <${ GAP_CATEGORIES.join('|') }>\n${ USAGE }`);
  }
  return { nodeId: options.correct, component: words[0], props: words.slice(1), gap: options.gap };
}

export function parseArgs(argv: ReadonlyArray<string>): ParsedCli {
  const { options, rest } = parseFlags<CliOptions>(argv, FLAGS, { ...DEFAULT_OPTIONS }, { kind: 'reject', usage: USAGE });
  if (rest.length === 0) throw new Error(`Missing the Figma node URL\n${ USAGE }`);
  const ref = parseNodeRef(rest[0]);
  if (ref === undefined) throw new Error(`Not a Figma node URL: ${ rest[0] }\n${ USAGE }`);
  return { options, ref, correction: parseCorrection(options, rest.slice(1)) };
}

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

// The regions default to the outline's content root; chrome the outline dropped is excluded either way.
export function readoutOf(entry: NodeEntry, regionIds: ReadonlyArray<string> | undefined, spriteNames: ReadonlyArray<string>): Readout {
  const root = entry.document;
  const outline = scopeOutline(root);
  const regions = regionIds ?? [ outline.contentRoot.id ];
  const nodes = regions.map((id) => {
    const node = findNode(root, id);
    if (node === undefined) throw new Error(`Region ${ id } is not under node ${ root.id }.`);
    return node;
  });
  const excluded = new Set(outline.chrome.map((dropped) => dropped.id));
  const map = buildThemeColorMap();
  const extraction = extractValues(entry, nodes, excluded, map);
  return { regions, extraction, recognitions: recognize(extraction.leaves, spriteNames, map, extraction.colorMode.mode) };
}

export interface CorrectionOutcome {
  readonly record: SidecarRecord;
  readonly gapLine: string;
}

// Offline on purpose: the correction is about the sidecar the developer just read, so a fetch would
// only risk writing a correction against values they have not seen.
export function recordCorrection(mainCheckout: string, ref: NodeRef, request: CorrectionRequest, now: Date): CorrectionOutcome {
  const target = sidecarPath(mainCheckout, ref.fileKey, ref.nodeId);
  if (!fs.existsSync(target)) throw new Error(`No sidecar for node ${ ref.nodeId }: run the readout first; it writes ${ target }.`);
  const recordedAt = now.toISOString();
  const correction: Correction = { component: request.component, props: request.props, gap: request.gap, recordedAt, stale: false };
  const record = applyCorrection(readSidecar(target), request.nodeId, correction);
  writeSidecar(target, record);
  const node = record.nodes.find((candidate) => candidate.id === request.nodeId);
  if (node === undefined) throw new Error(`Node ${ request.nodeId } vanished from the sidecar while correcting it.`);
  const gapLine = appendGap(gapLogPath(mainCheckout), { date: recordedAt.split('T')[0], fileKey: ref.fileKey, nodeId: request.nodeId, correction, node });
  return { record, gapLine };
}

function runCorrection(ref: NodeRef, request: CorrectionRequest): void {
  const mainCheckout = resolveMainCheckout(process.cwd());
  const { gapLine } = recordCorrection(mainCheckout, ref, request, new Date());
  console.log(`Correction recorded for ${ request.nodeId } in ${ sidecarPath(mainCheckout, ref.fileKey, ref.nodeId) }`);
  console.log(`Gap logged in ${ gapLogPath(mainCheckout) }:`);
  console.log(gapLine);
}

async function runReadout(ref: NodeRef, options: CliOptions): Promise<void> {
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

async function main(): Promise<void> {
  const { options, ref, correction } = parseArgs(process.argv.slice(2));
  if (correction !== undefined) {
    runCorrection(ref, correction);
    return;
  }
  await runReadout(ref, options);
}

// run.sh always executes the compiled `tools/design-readout/dist/tools/design-readout/index.js`, so that path
// is what marks this module as the process entry point; under vitest the entry is vitest's own binary.
const CLI_ENTRY_PATH = 'design-readout/dist/tools/design-readout/index.js';

function isProcessEntryPoint(): boolean {
  const entry = process.argv[1]?.replace(/\\/g, '/');
  return entry !== undefined && entry.endsWith(CLI_ENTRY_PATH);
}

if (isProcessEntryPoint()) {
  main().catch((error: unknown) => {
    const message = error instanceof Error ? error.message : String(error);
    console.error(error instanceof FigmaFetchError ? message : `design:readout failed: ${ message }`);
    process.exitCode = 1;
  });
}
