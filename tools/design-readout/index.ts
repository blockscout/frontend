/* eslint-disable no-console -- this is a CLI whose entire job is to print an outline to stdout */
import fs from 'fs';
import path from 'path';

import type { FlagSpec } from '../cli/flags';
import { parseArgs as parseFlags } from '../cli/flags';
import type { NodesResponse } from './figma';
import { FigmaFetchError, fetchNodes, rootOf } from './figma';
import { describeNode, renderOutline, scopeOutline, summarize } from './scope';
import type { NodeRef } from './url';
import { parseNodeRef } from './url';

export interface CliOptions {
  dump: string | undefined;
}

const USAGE = `Usage:
  design:readout <figma node URL> [--dump <path>]

  Reads the node through the Figma REST API and prints its scoping outline for you to confirm: the
  content root the tool descended to and the chrome dropped at each level with the rule that dropped
  it. One link is one screen: a hidden layer (visibility off) is not part of it and is ignored; a
  state or a mobile variant of the screen is its own node and its own link.

  <figma node URL>     https://www.figma.com/design/<fileKey>/<name>?node-id=<A>-<B>
                       (the node id is accepted as A-B or A:B; the file key comes from the URL)
  --dump <path>        also write the raw REST payload to this file, e.g. to capture a test fixture

  The run needs a Figma personal access token in the environment and fails without one; it never
  reads another source. Personal access tokens expire after at most 90 days, so a rejected token
  usually means a new one is due.`;

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
]);

export interface ParsedCli {
  readonly options: CliOptions;
  readonly ref: NodeRef;
}

export function parseArgs(argv: ReadonlyArray<string>): ParsedCli {
  const { options, rest } = parseFlags<CliOptions>(argv, FLAGS, { dump: undefined }, { kind: 'reject', usage: USAGE });
  if (rest.length === 0) throw new Error(`Missing the Figma node URL\n${ USAGE }`);
  if (rest.length > 1) throw new Error(`Unexpected argument: ${ rest[1] }\n${ USAGE }`);
  const ref = parseNodeRef(rest[0]);
  if (ref === undefined) throw new Error(`Not a Figma node URL: ${ rest[0] }\n${ USAGE }`);
  return { options, ref };
}

function renderHeader(payload: NodesResponse, ref: NodeRef): string {
  return [
    `File: ${ payload.name } — version ${ payload.version }, last modified ${ payload.lastModified }`,
    `Node: ${ describeNode(summarize(rootOf(payload, ref.nodeId))) }`,
  ].join('\n');
}

export function dumpPayload(target: string, payload: NodesResponse, cwd: string): string {
  const file = path.resolve(cwd, target);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(payload, null, 2) + '\n');
  return file;
}

async function main(): Promise<void> {
  const { options, ref } = parseArgs(process.argv.slice(2));
  const payload = await fetchNodes(ref);
  if (options.dump !== undefined) console.log(`Raw payload written to ${ dumpPayload(options.dump, payload, process.cwd()) }`);
  console.log(renderHeader(payload, ref));
  console.log('');
  console.log(renderOutline(scopeOutline(rootOf(payload, ref.nodeId))));
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
