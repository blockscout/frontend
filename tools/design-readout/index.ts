/* eslint-disable no-console -- this is a CLI whose entire job is to print an outline to stdout */
import fs from 'fs';
import path from 'path';

import { resolveCheckoutRoot, resolveMainCheckout } from '../cli/checkout';
import type { FlagSpec } from '../cli/flags';
import { parseArgs as parseFlags } from '../cli/flags';
import type { CalibrationEntry } from './calibration';
import { calibrateSet, calibrationDir, describeRefresh, hasMiss, loadCalibration, refreshEntry, renderCalibration } from './calibration';
import { buildThemeColorMap } from './colormap';
import { CALIBRATION_DIR, GAP_CATEGORIES, OVERRIDE_COLOR_PROPS } from './config';
import type { FigmaNode, NodeEntry, NodesResponse } from './figma';
import { entryOf, FigmaFetchError, fetchNodes } from './figma';
import type { GapAppend } from './gaps';
import { appendGap, gapLogPath } from './gaps';
import type { ColorTokens, Recognition } from './recognize';
import { loadSpriteNames, recognize, renderRecognition } from './recognize';
import { carryCorrections, diffRecords, renderRerun } from './rerun';
import { describeNode, renderOutline, scopeOutline, summarize } from './scope';
import type { Correction, GapCategory, NodeRecord, Override, SidecarRecord } from './sidecar';
import { applyCorrection, applyOverride, buildRecord, isGapCategory, readSidecar, sidecarPath, writeSidecar } from './sidecar';
import type { NodeRef } from './url';
import { parseNodeId as parseCanonicalNodeId, parseNodeRef } from './url';
import type { Extraction } from './values';
import { extractRegions, renderExtraction } from './values';

export interface CliOptions {
  dump: string | undefined;
  regions: ReadonlyArray<string> | undefined;
  correct: string | undefined;
  gap: GapCategory | undefined;
  override: string | undefined;
  calibrate: boolean;
  refresh: boolean;
}

const USAGE = `Usage:
  design:readout <figma node URL> [--regions <ids>] [--dump <path>]
  design:readout <figma node URL> --correct <nodeId> <component> [<props…>] --gap <category>
  design:readout <figma node URL> --override <nodeId> <prop=value> [<prop=value…>]
  design:readout --calibrate
  design:readout --refresh [<entry>]

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
  gap log beside the sidecars (.ai/design-readout/gaps.md); the same miss on another node of the
  same file (same category, same values, same correction) adds no line. It works on the existing
  sidecar and needs no token. A correction is always a miss, so --gap is required with it.

  --override records a deliberate style change on a node the tool read right: the shipped component
  with these Chakra props, as <prop>=<value> words (bg=whiteAlpha.100, color=text.primary,
  fontWeight=500) — the prop name as written in JSX, the value a theme token or a plain value, no
  spaces inside a word. An override is never a miss: it names no component, takes no --gap and logs
  no gap line; the disagreement is design intent. A color prop (${ Object.keys(OVERRIDE_COLOR_PROPS).join(', ') }) is
  checked against the tokens the node resolved for that fill and refused when the mockup does not
  draw it; any other prop is taken as given. Repeating --override on a node replaces the earlier
  override whole. Like --correct it works on the existing sidecar and needs no token; the two are
  separate runs.

  --calibrate runs recognition over the committed calibration set (${ CALIBRATION_DIR }: one folder
  per labeled node with the tool's own value snapshot and the expected component, props and signals
  per cell) offline, with no token, and prints hits and misses per entry and per signal; any miss
  exits non-zero. --refresh re-fetches every snapshot (or one entry's) from Figma with the token; a
  node that is gone marks its entry stale, which --calibrate then skips.

  <figma node URL>     https://www.figma.com/design/<fileKey>/<name>?node-id=<A>-<B>
                       (the node id is accepted as A-B or A:B; a node inside a component instance
                       carries the instance path, I<A>:<B>;<C>:<D>; the file key comes from the URL)
  --regions <ids>      the confirmed regions, comma-separated node ids (A-B or A:B); default: the
                       content root the outline names
  --dump <path>        also write the raw REST payload to this file, e.g. to capture a test fixture
  --correct <nodeId>   the leaf to correct, by node id (A-B or A:B), followed by the repo component
                       it is and any props, as words: --correct 22842-178386 BlockEntity noIcon
  --gap <category>     the kind of miss the correction fixes: ${ GAP_CATEGORIES.join(', ') }
  --override <nodeId>  the leaf the mockup styles on purpose, by node id (A-B or A:B), followed by
                       the Chakra props it adds, as words: --override 22842-178386 bg=whiteAlpha.100
  --calibrate          check the calibration set; takes no URL
  --refresh [<entry>]  re-capture the calibration snapshots, or the one entry named by its folder

  The run needs a Figma personal access token in the environment and fails without one; it never
  reads another source. Personal access tokens expire after at most 90 days, so a rejected token
  usually means a new one is due.`;

function parseNodeId(raw: string, flag: string): string {
  const nodeId = parseCanonicalNodeId(raw);
  if (nodeId === undefined) throw new Error(`Not a node id in ${ flag }: ${ raw.trim() }\n${ USAGE }`);
  return nodeId;
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
  [ '--override', { kind: 'value', apply: (options, value) => {
    options.override = parseNodeId(value, '--override');
  } } ],
  [ '--calibrate', { kind: 'switch', apply: (options) => {
    options.calibrate = true;
  } } ],
  [ '--refresh', { kind: 'switch', apply: (options) => {
    options.refresh = true;
  } } ],
]);

export interface CorrectionRequest {
  readonly nodeId: string;
  readonly component: string;
  readonly props: ReadonlyArray<string>;
  readonly gap: GapCategory;
}

export interface OverrideRequest {
  readonly nodeId: string;
  readonly props: ReadonlyArray<string>;
}

export type ParsedCli =
  { readonly kind: 'readout'; readonly options: CliOptions; readonly ref: NodeRef } |
  { readonly kind: 'correct'; readonly ref: NodeRef; readonly correction: CorrectionRequest } |
  { readonly kind: 'override'; readonly ref: NodeRef; readonly override: OverrideRequest } |
  { readonly kind: 'calibrate' } |
  { readonly kind: 'refresh'; readonly entry: string | undefined };

const DEFAULT_OPTIONS: CliOptions = {
  dump: undefined, regions: undefined, correct: undefined, gap: undefined, override: undefined, calibrate: false, refresh: false,
};

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

// An override is not a correction: no component, no --gap, and never in the same run as --correct.
function parseOverride(options: CliOptions, words: ReadonlyArray<string>): OverrideRequest | undefined {
  if (options.override === undefined) return undefined;
  if (options.correct !== undefined || options.gap !== undefined) {
    throw new Error(`--override and --correct are separate runs: an override is never a miss and takes no --gap\n${ USAGE }`);
  }
  if (words.length === 0) throw new Error(`--override ${ options.override } needs at least one <prop>=<value> word, after the URL\n${ USAGE }`);
  const bare = words.find((word) => !/^[^=\s]+=\S+$/.test(word));
  if (bare !== undefined) throw new Error(`An override is one <prop>=<value> per word, no spaces inside: ${ bare }\n${ USAGE }`);
  return { nodeId: options.override, props: words };
}

// --calibrate and --refresh work on the committed set, not on a node: neither takes a URL or any
// of the per-node flags.
function parseSetCommand(options: CliOptions, rest: ReadonlyArray<string>): ParsedCli {
  const flag = options.calibrate ? '--calibrate' : '--refresh';
  if (options.calibrate && options.refresh) throw new Error(`--calibrate and --refresh are separate runs\n${ USAGE }`);
  const perNode = [ options.dump, options.regions, options.correct, options.gap, options.override ].some((value) => value !== undefined);
  if (perNode) throw new Error(`${ flag } works on the calibration set and takes no per-node flag\n${ USAGE }`);
  if (options.calibrate) {
    if (rest.length > 0) throw new Error(`--calibrate takes no argument: ${ rest[0] }\n${ USAGE }`);
    return { kind: 'calibrate' };
  }
  if (rest.length > 1) throw new Error(`--refresh takes at most one entry name: ${ rest.join(' ') }\n${ USAGE }`);
  return { kind: 'refresh', entry: rest[0] };
}

export function parseArgs(argv: ReadonlyArray<string>): ParsedCli {
  const { options, rest } = parseFlags<CliOptions>(argv, FLAGS, { ...DEFAULT_OPTIONS }, { kind: 'reject', usage: USAGE });
  if (options.calibrate || options.refresh) return parseSetCommand(options, rest);
  if (rest.length === 0) throw new Error(`Missing the Figma node URL\n${ USAGE }`);
  const ref = parseNodeRef(rest[0]);
  if (ref === undefined) throw new Error(`Not a Figma node URL: ${ rest[0] }\n${ USAGE }`);
  const override = parseOverride(options, rest.slice(1));
  if (override !== undefined) return { kind: 'override', ref, override };
  const correction = parseCorrection(options, rest.slice(1));
  return correction === undefined ? { kind: 'readout', options, ref } : { kind: 'correct', ref, correction };
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

function runOverride(ref: NodeRef, request: OverrideRequest): void {
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
  const gap = appendGap(gapLogPath(mainCheckout), { date: recordedAt.split('T')[0], fileKey: ref.fileKey, nodeId: request.nodeId, correction, node });
  return { record, gap };
}

function runCorrection(ref: NodeRef, request: CorrectionRequest): void {
  const mainCheckout = resolveMainCheckout(process.cwd());
  const { gap } = recordCorrection(mainCheckout, ref, request, new Date());
  console.log(`Correction recorded for ${ request.nodeId } in ${ sidecarPath(mainCheckout, ref.fileKey, ref.nodeId) }`);
  console.log(gap.appended ? `Gap logged in ${ gapLogPath(mainCheckout) }:` : `Same miss already in ${ gapLogPath(mainCheckout) }, no line added:`);
  console.log(gap.line);
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

function runCalibrate(): void {
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

async function runRefresh(name: string | undefined): Promise<void> {
  const entries = selectEntries(loadCalibration(calibrationDir(resolveCheckoutRoot(process.cwd()))), name);
  const map = buildThemeColorMap();
  console.log(`Refreshing ${ entries.length } calibration ${ entries.length === 1 ? 'entry' : 'entries' }:`);
  for (const entry of entries) {
    console.log(describeRefresh(await refreshEntry(entry, fetchNodes, new Date(), map)));
  }
}

async function main(): Promise<void> {
  const parsed = parseArgs(process.argv.slice(2));
  switch (parsed.kind) {
    case 'correct':
      runCorrection(parsed.ref, parsed.correction);
      return;
    case 'override':
      runOverride(parsed.ref, parsed.override);
      return;
    case 'calibrate':
      runCalibrate();
      return;
    case 'refresh':
      await runRefresh(parsed.entry);
      return;
    case 'readout':
      await runReadout(parsed.ref, parsed.options);
  }
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
