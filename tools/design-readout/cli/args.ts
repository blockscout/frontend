/* eslint-disable no-console -- --help prints the usage to stdout and exits */
import type { FlagSpec } from '../../cli/flags';
import { parseArgs as parseFlags } from '../../cli/flags';
import { CALIBRATION_DIR, GAP_CATEGORIES, OVERRIDE_COLOR_PROPS } from '../config';
import type { NodeRef } from '../fetch/url';
import { parseNodeId as parseCanonicalNodeId, parseNodeRef } from '../fetch/url';
import type { GapCategory } from '../record/sidecar';
import { isGapCategory } from '../record/sidecar';

export interface CliOptions {
  dump: string | undefined;
  regions: ReadonlyArray<string> | undefined;
  correct: string | undefined;
  gap: GapCategory | undefined;
  override: string | undefined;
  note: string | undefined;
  calibrate: boolean;
  refresh: boolean;
}

const USAGE = `Usage:
  design:readout <figma node URL> [--regions <ids>] [--dump <path>]
  design:readout <figma node URL> --correct <nodeId> <component> [<props…>] --gap <category>
  design:readout <figma node URL> --override <nodeId> <prop=value> [<prop=value…>]
  design:readout <figma node URL> --note "<text>" --gap <category>
  design:readout --calibrate
  design:readout --refresh [<entry>]

  Reads one node through the Figma REST API and prints the scoping outline to confirm, the values of
  every leaf under the confirmed regions, and what it recognizes per leaf. The values go to a JSON
  sidecar under the main checkout's .ai/design-readout/. A node that already has a sidecar prints a
  diff against it instead; a correction or override whose values changed is carried but flagged STALE.

  One link is one screen: hidden layers are ignored, and a state or a mobile variant is its own link.
  The tool names no component; a correction does. Corrections and notes are misses and go to the gap
  log (.ai/design-readout/gaps.md); an override is design intent and logs nothing. --correct,
  --override and --note are separate runs, offline, on the existing sidecar.

  <figma node URL>     https://www.figma.com/design/<fileKey>/<name>?node-id=<A>-<B>
                       (the node id is accepted as A-B or A:B; a node inside a component instance
                       carries the instance path, I<A>:<B>;<C>:<D>)
  --regions <ids>      the confirmed regions, comma-separated node ids (A-B or A:B); default: the
                       content root the outline names
  --dump <path>        also write the raw REST payload to this file, e.g. to capture a test fixture
  --correct <nodeId>   what the leaf really is: the repo component, then any props, as words;
                       the same miss on another node of the same file adds no gap line:
                       --correct 22842-178386 BlockEntity noIcon --gap shape
  --gap <category>     the kind of miss a correction or note records: ${ GAP_CATEGORIES.join(', ') }
  --override <nodeId>  the Chakra props the mockup adds on purpose, as <prop>=<value> words, no spaces
                       inside a word; replaces the node's earlier override whole. A color prop
                       (${ Object.keys(OVERRIDE_COLOR_PROPS).join(', ') }) must name a token the node resolved for that fill:
                       --override 22842-178386 bg=whiteAlpha.100
  --note "<text>"      a miss found in the running app that maps to no node; the URL supplies the
                       file key only: --note "row gap is 8px, mockup has 12px" --gap layout
  --calibrate          run recognition over the committed calibration set (${ CALIBRATION_DIR }),
                       offline; any miss exits non-zero
  --refresh [<entry>]  re-capture every calibration snapshot from Figma, or one entry's; a node that
                       is gone marks its entry stale and --calibrate skips it

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
  [ '--note', { kind: 'value', apply: (options, value) => {
    options.note = value;
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

export interface NoteRequest {
  readonly text: string;
  readonly gap: GapCategory;
}

export type ParsedCli =
  { readonly kind: 'readout'; readonly options: CliOptions; readonly ref: NodeRef } |
  { readonly kind: 'correct'; readonly ref: NodeRef; readonly correction: CorrectionRequest } |
  { readonly kind: 'override'; readonly ref: NodeRef; readonly override: OverrideRequest } |
  { readonly kind: 'note'; readonly ref: NodeRef; readonly note: NoteRequest } |
  { readonly kind: 'calibrate' } |
  { readonly kind: 'refresh'; readonly entry: string | undefined };

const DEFAULT_OPTIONS: CliOptions = {
  dump: undefined, regions: undefined, correct: undefined, gap: undefined, override: undefined, note: undefined, calibrate: false, refresh: false,
};

// A note is its own run: it names no node, so it sits beside neither --correct nor --override, and
// like a correction it is always a miss.
function parseNote(options: CliOptions, words: ReadonlyArray<string>): NoteRequest | undefined {
  if (options.note === undefined) return undefined;
  if (options.correct !== undefined || options.override !== undefined) {
    throw new Error(`--note is its own run: a note names no node, so it goes with neither --correct nor --override\n${ USAGE }`);
  }
  if (options.gap === undefined) throw new Error(`A note is always a miss: --note needs --gap <${ GAP_CATEGORIES.join('|') }>\n${ USAGE }`);
  if (options.note.trim() === '') throw new Error(`--note needs the text of the miss, in quotes\n${ USAGE }`);
  if (words.length > 0) throw new Error(`Unexpected argument: ${ words[0] }\n${ USAGE }`);
  return { text: options.note.trim(), gap: options.gap };
}

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
  const perNode = [ options.dump, options.regions, options.correct, options.gap, options.override, options.note ].some((value) => value !== undefined);
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
  const note = parseNote(options, rest.slice(1));
  if (note !== undefined) return { kind: 'note', ref, note };
  const override = parseOverride(options, rest.slice(1));
  if (override !== undefined) return { kind: 'override', ref, override };
  const correction = parseCorrection(options, rest.slice(1));
  return correction === undefined ? { kind: 'readout', options, ref } : { kind: 'correct', ref, correction };
}
