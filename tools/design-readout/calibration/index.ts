import fs from 'fs';
import path from 'path';
import * as v from 'valibot';

import { CALIBRATION_DIR } from '../config';
import type { Leaf } from '../extract/values';
import { extractRegions, frameBackground } from '../extract/values';
import type { NodeEntry, NodesResponse } from '../fetch/figma';
import { FigmaFetchError } from '../fetch/figma';
import type { NodeRef } from '../fetch/url';
import { parseNodeRef } from '../fetch/url';
import type { ColorMap, ColorRole, ColorValue } from '../recognize/colormap';
import { buildThemeColorMap, detectColorMode } from '../recognize/colormap';
import type { Recognition } from '../recognize/signals';
import { COMPOSITE_RULES, recognize, TEXT_SHAPE_RULES } from '../recognize/signals';

export const SNAPSHOT_VERSION = 1;
export const SNAPSHOT_FILE = 'snapshot.json';
export const EXPECTED_FILE = 'expected.json';

const COLOR_ROLES: ReadonlyArray<ColorRole> = [ 'text', 'background', 'border', 'icon' ];

const ROLE_COLOR = v.object({ role: v.picklist(COLOR_ROLES), hex: v.string(), alpha: v.number() });

const FONT = v.object({
  family: v.optional(v.string(), undefined),
  weight: v.optional(v.number(), undefined),
  size: v.optional(v.number(), undefined),
  lineHeight: v.optional(v.number(), undefined),
});

const LEAF_VALUES = v.variant('kind', [
  v.object({
    kind: v.literal('text'),
    text: v.string(),
    trailingGlyphs: v.optional(v.string(), undefined),
    font: v.optional(FONT, undefined),
    colors: v.array(ROLE_COLOR),
  }),
  v.object({ kind: v.literal('icon'), icon: v.string(), colors: v.array(ROLE_COLOR) }),
  v.object({ kind: v.literal('box'), colors: v.array(ROLE_COLOR) }),
]);

const BOX = v.object({ x: v.number(), y: v.number(), width: v.number(), height: v.number() });

// The tool's own extraction for the node, captured by `--refresh`: never a raw Figma payload, never a hint.
const SNAPSHOT = v.object({
  version: v.literal(SNAPSHOT_VERSION),
  fileKey: v.string(),
  nodeId: v.string(),
  capturedAt: v.string(),
  file: v.object({ lastModified: v.string(), version: v.string() }),
  regions: v.array(v.string()),
  frameBackground: v.nullable(v.object({ hex: v.string(), alpha: v.number() })),
  leaves: v.array(v.object({ id: v.string(), values: LEAF_VALUES, bbox: v.nullable(BOX) })),
});

export interface Snapshot {
  readonly version: number;
  readonly fileKey: string;
  readonly nodeId: string;
  readonly capturedAt: string;
  readonly file: { readonly lastModified: string; readonly version: string };
  readonly regions: ReadonlyArray<string>;
  readonly frameBackground: ColorValue | null;
  readonly leaves: ReadonlyArray<Leaf>;
}

const STATUSES = [ 'recognized', 'ambiguous', 'unrecognized' ] as const;

// What recognition must say for one leaf, read off the shipped component: which repo component and
// props render the cell, and per signal what should fire. A signal left out is not checked; `status`
// alone pins a leaf the tool rightly cannot settle (an identicon is no sprite).
const EXPECTED_CELL = v.object({
  component: v.string(),
  props: v.record(v.string(), v.union([ v.string(), v.number(), v.boolean() ])),
  status: v.optional(v.picklist(STATUSES)),
  shape: v.optional(v.picklist(TEXT_SHAPE_RULES.map((rule) => rule.signal))),
  icon: v.optional(v.string()),
  color: v.optional(v.partial(v.object({ text: v.string(), background: v.string(), border: v.string(), icon: v.string() }))),
  composite: v.optional(v.picklist(COMPOSITE_RULES.map((rule) => rule.signal))),
});

export type ExpectedCell = v.InferOutput<typeof EXPECTED_CELL>;

const EXPECTED = v.object({
  url: v.pipe(v.string(), v.check((url) => parseNodeRef(url) !== undefined, 'not a Figma node URL')),
  nodeId: v.string(),
  component: v.string(),
  regions: v.optional(v.array(v.string())),
  stale: v.boolean(),
  cells: v.record(v.string(), EXPECTED_CELL),
});

export type Expected = v.InferOutput<typeof EXPECTED>;

export interface CalibrationEntry {
  readonly name: string;
  readonly dir: string;
  readonly expected: Expected;
  readonly snapshot: Snapshot | undefined;
}

export function calibrationDir(checkoutRoot: string): string {
  return path.join(checkoutRoot, CALIBRATION_DIR);
}

function readJson(file: string): unknown {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function parseOrThrow<TSchema extends v.GenericSchema>(schema: TSchema, input: unknown, file: string): v.InferOutput<TSchema> {
  const result = v.safeParse(schema, input);
  if (result.success) return result.output;
  const issues = result.issues.map((issue) => `${ v.getDotPath(issue) ?? '(root)' }: ${ issue.message }`).join('; ');
  throw new Error(`Not a valid calibration file ${ file }: ${ issues }`);
}

function validateCells(entry: CalibrationEntry): void {
  if (entry.snapshot === undefined) return;
  const leafIds = new Set(entry.snapshot.leaves.map((leaf) => leaf.id));
  for (const nodeId of Object.keys(entry.expected.cells)) {
    if (leafIds.has(nodeId)) continue;
    throw new Error(`Calibration entry ${ entry.name }: cell ${ nodeId } is not a leaf of its snapshot; the leaves are ${ [ ...leafIds ].join(', ') }.`);
  }
}

// JSON drops a leaf's `undefined` keys, so the schema reads them back as optional; `Leaf` wants them
// present-and-undefined, which the same object satisfies at run time.
function readSnapshot(file: string): Snapshot {
  return parseOrThrow(SNAPSHOT, readJson(file), file) as Snapshot;
}

export function loadEntry(dir: string): CalibrationEntry {
  const name = path.basename(dir);
  const expectedFile = path.join(dir, EXPECTED_FILE);
  if (!fs.existsSync(expectedFile)) throw new Error(`Calibration entry ${ name } has no ${ EXPECTED_FILE }.`);
  const snapshotFile = path.join(dir, SNAPSHOT_FILE);
  const entry: CalibrationEntry = {
    name,
    dir,
    expected: parseOrThrow(EXPECTED, readJson(expectedFile), expectedFile),
    snapshot: fs.existsSync(snapshotFile) ? readSnapshot(snapshotFile) : undefined,
  };
  validateCells(entry);
  return entry;
}

// One entry per sub-folder, in name order; a file at the top level is not an entry.
export function loadCalibration(dir: string): ReadonlyArray<CalibrationEntry> {
  if (!fs.existsSync(dir)) throw new Error(`No calibration set at ${ dir }.`);
  return fs.readdirSync(dir, { withFileTypes: true })
    .filter((item) => item.isDirectory())
    .map((item) => item.name)
    .sort()
    .map((name) => loadEntry(path.join(dir, name)));
}

export type CalibrationSignal = 'shape' | 'icon' | 'color' | 'composite';

export const CALIBRATION_SIGNALS: ReadonlyArray<CalibrationSignal> = [ 'shape', 'icon', 'color', 'composite' ];

export interface SignalCheck {
  readonly signal: CalibrationSignal;
  readonly expected: string;
  readonly actual: string;
  readonly hit: boolean;
}

export interface CellResult {
  readonly nodeId: string;
  readonly component: string;
  readonly checks: ReadonlyArray<SignalCheck>;
}

export type EntryResult =
  { readonly name: string; readonly kind: 'checked'; readonly colorMode: string; readonly cells: ReadonlyArray<CellResult> } |
  { readonly name: string; readonly kind: 'stale' } |
  { readonly name: string; readonly kind: 'no-snapshot' };

function signalOfLeaf(leaf: Leaf): CalibrationSignal {
  switch (leaf.values.kind) {
    case 'text':
      return 'shape';
    case 'icon':
      return 'icon';
    case 'box':
      return 'color';
  }
}

function describeDecision(recognition: Recognition): string {
  const { decision } = recognition;
  if (decision === null) return 'none';
  return decision.signal === 'icon' ? decision.icon : decision.signal;
}

// Shape and icon are one check with the status folded in: a hash recognized as a hash but left
// ambiguous is not a hit for a cell that expects it settled, and a cell may expect `ambiguous`.
function checkDecision(cell: ExpectedCell, leaf: Leaf, recognition: Recognition): SignalCheck | undefined {
  const expectedDecision = cell.shape ?? cell.icon;
  const expectedStatus = cell.status ?? (expectedDecision === undefined ? undefined : 'recognized');
  if (expectedStatus === undefined) return undefined;
  const actualDecision = describeDecision(recognition);
  const decisionHit = expectedDecision === undefined || expectedDecision === actualDecision;
  const statusHit = expectedStatus === recognition.status;
  return {
    signal: signalOfLeaf(leaf),
    expected: `${ expectedDecision ?? 'any' }, ${ expectedStatus }`,
    actual: `${ actualDecision }, ${ recognition.status }`,
    hit: decisionHit && statusHit,
  };
}

function checkColors(cell: ExpectedCell, recognition: Recognition): Array<SignalCheck> {
  return Object.entries(cell.color ?? {}).map(([ role, token ]) => {
    const resolved = recognition.tokens.filter((entry) => entry.role === role).flatMap((entry) => entry.tokens);
    const actual = resolved.length === 0 ? 'no token' : resolved.join(', ');
    return { signal: 'color', expected: `${ role } ${ token }`, actual: `${ role } ${ actual }`, hit: resolved.includes(token) };
  });
}

function checkComposite(cell: ExpectedCell, recognition: Recognition): SignalCheck | undefined {
  if (cell.composite === undefined) return undefined;
  const actual = recognition.composite?.signal ?? 'none';
  return { signal: 'composite', expected: cell.composite, actual, hit: actual === cell.composite };
}

function checkCell(nodeId: string, cell: ExpectedCell, leaf: Leaf, recognition: Recognition): CellResult {
  const checks = [ checkDecision(cell, leaf, recognition), ...checkColors(cell, recognition), checkComposite(cell, recognition) ]
    .filter((check) => check !== undefined);
  return { nodeId, component: cell.component, checks };
}

export function calibrateEntry(entry: CalibrationEntry, spriteNames: ReadonlyArray<string>, map: ColorMap): EntryResult {
  if (entry.expected.stale) return { name: entry.name, kind: 'stale' };
  if (entry.snapshot === undefined) return { name: entry.name, kind: 'no-snapshot' };
  const { leaves, frameBackground: background } = entry.snapshot;
  const mode = detectColorMode(map, leaves.flatMap((leaf) => leaf.values.colors), background ?? undefined).mode;
  const recognitions = recognize(leaves, spriteNames, map, mode);
  const byId = new Map(leaves.map((leaf, index) => [ leaf.id, { leaf, recognition: recognitions[index] } ]));
  const cells = Object.entries(entry.expected.cells).map(([ nodeId, cell ]) => {
    const found = byId.get(nodeId);
    if (found === undefined) throw new Error(`Calibration entry ${ entry.name }: cell ${ nodeId } has no leaf.`);
    return checkCell(nodeId, cell, found.leaf, found.recognition);
  });
  return { name: entry.name, kind: 'checked', colorMode: mode, cells };
}

export function calibrateSet(
  entries: ReadonlyArray<CalibrationEntry>,
  spriteNames: ReadonlyArray<string>,
  map: ColorMap = buildThemeColorMap(),
): ReadonlyArray<EntryResult> {
  return entries.map((entry) => calibrateEntry(entry, spriteNames, map));
}

function checksOf(results: ReadonlyArray<EntryResult>): Array<SignalCheck> {
  return results.flatMap((result) => result.kind === 'checked' ? result.cells.flatMap((cell) => cell.checks) : []);
}

// A miss is a failed check or an entry that cannot be checked at all; a stale entry is neither.
export function hasMiss(results: ReadonlyArray<EntryResult>): boolean {
  return results.some((result) => result.kind === 'no-snapshot') || checksOf(results).some((check) => !check.hit);
}

function describeMiss(check: SignalCheck): string {
  return `${ check.signal }: expected ${ check.expected }; got ${ check.actual }`;
}

function renderEntry(result: EntryResult): Array<string> {
  switch (result.kind) {
    case 'stale':
      return [ `  ${ result.name }: stale, skipped (the node is gone from Figma; --refresh ${ result.name } when it is back)` ];
    case 'no-snapshot':
      return [ `  ${ result.name }: MISS, no ${ SNAPSHOT_FILE } (run --refresh ${ result.name })` ];
    case 'checked': {
      const checks = result.cells.flatMap((cell) => cell.checks);
      const misses = result.cells.flatMap((cell) => cell.checks.filter((check) => !check.hit).map((check) => ({ cell, check })));
      return [
        `  ${ result.name } (${ result.colorMode }): ${ result.cells.length } cells, ${ checks.length } checks, ${ misses.length } misses`,
        ...misses.map(({ cell, check }) => `    MISS ${ cell.nodeId } ${ cell.component } ${ describeMiss(check) }`),
      ];
    }
  }
}

function renderSignalTable(checks: ReadonlyArray<SignalCheck>): Array<string> {
  const rows = CALIBRATION_SIGNALS.map((signal) => {
    const own = checks.filter((check) => check.signal === signal);
    return { signal, hits: own.filter((check) => check.hit).length, misses: own.filter((check) => !check.hit).length };
  });
  const width = Math.max(...CALIBRATION_SIGNALS.map((signal) => signal.length));
  return [
    `${ 'signal'.padEnd(width) }  hits  misses`,
    ...rows.map((row) => `${ row.signal.padEnd(width) }  ${ String(row.hits).padStart(4) }  ${ String(row.misses).padStart(6) }`),
  ];
}

export function renderCalibration(results: ReadonlyArray<EntryResult>): string {
  const checked = results.filter((result) => result.kind === 'checked').length;
  const stale = results.filter((result) => result.kind === 'stale').length;
  const checks = checksOf(results);
  const misses = checks.filter((check) => !check.hit).length;
  return [
    `Calibration: ${ results.length } entries, ${ checked } checked, ${ stale } stale`,
    ...results.flatMap(renderEntry),
    '',
    ...renderSignalTable(checks),
    '',
    hasMiss(results) ? `FAIL: ${ misses } misses` : `PASS: ${ checks.length } checks`,
  ].join('\n');
}

export type FetchNodes = (ref: NodeRef) => Promise<NodesResponse>;

export type RefreshOutcome =
  { readonly name: string; readonly kind: 'refreshed'; readonly leaves: number } |
  { readonly name: string; readonly kind: 'stale'; readonly reason: string };

function writeJson(file: string, value: unknown): void {
  fs.writeFileSync(file, `${ JSON.stringify(value, null, 2) }\n`);
}

function refOf(expected: Expected): NodeRef {
  const ref = parseNodeRef(expected.url);
  if (ref === undefined) throw new Error(`Not a Figma node URL: ${ expected.url }`);
  return { fileKey: ref.fileKey, nodeId: expected.nodeId };
}

type FetchedEntry = { readonly payload: NodesResponse; readonly node: NodeEntry } | { readonly gone: string };

async function fetchEntryNode(ref: NodeRef, fetchNodes: FetchNodes): Promise<FetchedEntry> {
  try {
    const payload = await fetchNodes(ref);
    const node = payload.nodes[ref.nodeId];
    return node === undefined || node === null ? { gone: `node ${ ref.nodeId } is not in file "${ payload.name }"` } : { payload, node };
  } catch (error: unknown) {
    if (error instanceof FigmaFetchError && error.status === 404) return { gone: error.message };
    throw error;
  }
}

function plainColor(color: ColorValue | undefined): ColorValue | null {
  return color === undefined ? null : { hex: color.hex, alpha: color.alpha };
}

function markStale(entry: CalibrationEntry, reason: string): RefreshOutcome {
  writeJson(path.join(entry.dir, EXPECTED_FILE), { ...entry.expected, stale: true });
  return { name: entry.name, kind: 'stale', reason };
}

// A vanished node marks its entry stale and the run goes on; a token problem or any other failure
// stops the run, since every entry after it would fail the same way.
export async function refreshEntry(
  entry: CalibrationEntry,
  fetchNodes: FetchNodes,
  now: Date,
  map: ColorMap = buildThemeColorMap(),
): Promise<RefreshOutcome> {
  const ref = refOf(entry.expected);
  const fetched = await fetchEntryNode(ref, fetchNodes);
  if ('gone' in fetched) return markStale(entry, fetched.gone);
  const { payload, node } = fetched;
  const { regions, extraction } = extractRegions(node, entry.expected.regions, map);
  const snapshot: Snapshot = {
    version: SNAPSHOT_VERSION,
    fileKey: ref.fileKey,
    nodeId: ref.nodeId,
    capturedAt: now.toISOString(),
    file: { lastModified: payload.lastModified, version: payload.version },
    regions,
    frameBackground: plainColor(frameBackground(node.document)),
    leaves: extraction.leaves,
  };
  writeJson(path.join(entry.dir, SNAPSHOT_FILE), snapshot);
  writeJson(path.join(entry.dir, EXPECTED_FILE), { ...entry.expected, stale: false });
  return { name: entry.name, kind: 'refreshed', leaves: extraction.leaves.length };
}

export function describeRefresh(outcome: RefreshOutcome): string {
  return outcome.kind === 'refreshed' ?
    `  ${ outcome.name }: refreshed, ${ outcome.leaves } leaves` :
    `  ${ outcome.name }: STALE, ${ outcome.reason }`;
}
