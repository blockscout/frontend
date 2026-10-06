/* eslint-disable no-console -- this is a CLI whose entire job is to print an outline to stdout */
import fs from 'fs';
import path from 'path';

import { resolveMainCheckout } from '../cli/checkout';
import type { FlagSpec } from '../cli/flags';
import { parseArgs as parseFlags } from '../cli/flags';
import { buildThemeColorMap } from './colormap';
import type { FigmaNode, NodeEntry, NodesResponse } from './figma';
import { entryOf, FigmaFetchError, fetchNodes } from './figma';
import { describeNode, renderOutline, scopeOutline, summarize } from './scope';
import { buildRecord, sidecarPath, writeSidecar } from './sidecar';
import type { NodeRef } from './url';
import { parseNodeRef } from './url';
import type { Extraction } from './values';
import { extractValues, findNode, renderExtraction } from './values';

export interface CliOptions {
  dump: string | undefined;
  regions: ReadonlyArray<string> | undefined;
}

const USAGE = `Usage:
  design:readout <figma node URL> [--regions <ids>] [--dump <path>]

  Reads the node through the Figma REST API and prints its scoping outline for you to confirm: the
  content root the tool descended to and the chrome dropped at each level with the rule that dropped
  it. One link is one screen: a hidden layer (visibility off) is not part of it and is ignored; a
  state or a mobile variant of the screen is its own node and its own link.

  Then it extracts the values of every leaf under the confirmed regions — text, fills per role, font,
  icon instance name, trailing glyphs, bounding box — prints them with the Figma style and component
  names as hints (flagged where a hint disagrees with the value), and writes the values to one JSON
  sidecar under the main checkout's .ai/design-readout/. Hints are printed only, never written.

  <figma node URL>     https://www.figma.com/design/<fileKey>/<name>?node-id=<A>-<B>
                       (the node id is accepted as A-B or A:B; the file key comes from the URL)
  --regions <ids>      the confirmed regions, comma-separated node ids (A-B or A:B); default: the
                       content root the outline names
  --dump <path>        also write the raw REST payload to this file, e.g. to capture a test fixture

  The run needs a Figma personal access token in the environment and fails without one; it never
  reads another source. Personal access tokens expire after at most 90 days, so a rejected token
  usually means a new one is due.`;

const NODE_ID = /^(\d+)[-:](\d+)$/;

function parseRegionIds(value: string): Array<string> {
  return value.split(',').map((raw) => {
    const match = NODE_ID.exec(raw.trim());
    if (match === null) throw new Error(`Not a node id in --regions: ${ raw.trim() }\n${ USAGE }`);
    return `${ match[1] }:${ match[2] }`;
  });
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
]);

export interface ParsedCli {
  readonly options: CliOptions;
  readonly ref: NodeRef;
}

export function parseArgs(argv: ReadonlyArray<string>): ParsedCli {
  const { options, rest } = parseFlags<CliOptions>(argv, FLAGS, { dump: undefined, regions: undefined }, { kind: 'reject', usage: USAGE });
  if (rest.length === 0) throw new Error(`Missing the Figma node URL\n${ USAGE }`);
  if (rest.length > 1) throw new Error(`Unexpected argument: ${ rest[1] }\n${ USAGE }`);
  const ref = parseNodeRef(rest[0]);
  if (ref === undefined) throw new Error(`Not a Figma node URL: ${ rest[0] }\n${ USAGE }`);
  return { options, ref };
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
}

// The regions default to the outline's content root; chrome the outline dropped is excluded either way.
export function readoutOf(entry: NodeEntry, regionIds: ReadonlyArray<string> | undefined): Readout {
  const root = entry.document;
  const outline = scopeOutline(root);
  const regions = regionIds ?? [ outline.contentRoot.id ];
  const nodes = regions.map((id) => {
    const node = findNode(root, id);
    if (node === undefined) throw new Error(`Region ${ id } is not under node ${ root.id }.`);
    return node;
  });
  const excluded = new Set(outline.chrome.map((dropped) => dropped.id));
  return { regions, extraction: extractValues(entry, nodes, excluded, buildThemeColorMap()) };
}

async function main(): Promise<void> {
  const { options, ref } = parseArgs(process.argv.slice(2));
  const payload = await fetchNodes(ref);
  if (options.dump !== undefined) console.log(`Raw payload written to ${ dumpPayload(options.dump, payload, process.cwd()) }`);
  const entry = entryOf(payload, ref.nodeId);
  console.log(renderHeader(payload, entry.document));
  console.log('');
  console.log(renderOutline(scopeOutline(entry.document)));
  console.log('');
  const { regions, extraction } = readoutOf(entry, options.regions);
  console.log(`Regions: ${ regions.join(', ') }`);
  console.log(renderExtraction(extraction));
  const target = sidecarPath(resolveMainCheckout(process.cwd()), ref.fileKey, ref.nodeId);
  writeSidecar(target, buildRecord({
    createdAt: new Date().toISOString(),
    fileKey: ref.fileKey,
    nodeId: ref.nodeId,
    lastModified: payload.lastModified,
    fileVersion: payload.version,
    regions,
    leaves: extraction.leaves,
  }));
  console.log('');
  console.log(`Sidecar written to ${ target }`);
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
