import fs from 'fs';
import path from 'path';

import { GAP_LOG_FILE, SIDECAR_DIR } from './config';
import { describeWhy } from './recognize';
import type { Correction, NodeRecord } from './sidecar';
import { describeLeaf } from './values';

export interface GapEntry {
  readonly date: string;
  readonly fileKey: string;
  readonly nodeId: string;
  readonly correction: Correction;
  readonly node: NodeRecord;
}

export const GAP_LOG_HEADER = '# Design readout gap log — one line per miss: date | file key | node id | category | the tool said | the developer said';

export function gapLogPath(mainCheckout: string): string {
  return path.join(mainCheckout, SIDECAR_DIR, GAP_LOG_FILE);
}

function describeToolSaid(node: NodeRecord): string {
  return `${ node.status }: ${ describeLeaf(node) } — ${ describeWhy(node, node) }`;
}

function describeDeveloperSaid(correction: Correction): string {
  return correction.props.length === 0 ? correction.component : `${ correction.component } ${ correction.props.join(' ') }`;
}

export function formatGapLine({ date, fileKey, nodeId, correction, node }: GapEntry): string {
  return `- ${ date } | ${ fileKey } | ${ nodeId } | ${ correction.gap } | ${ describeToolSaid(node) } | ${ describeDeveloperSaid(correction) }`;
}

// A miss is the kind of thing the tool got wrong, not the node it got it wrong on: the same cell
// repeated down eight rows of a mockup is one miss, so the phase 2 count reads kinds. The key is the
// line without its date and node id.
function missOf(line: string): string {
  const [ , fileKey, nodeId, ...rest ] = line.replace(/^- /, '').split(' | ');
  return `${ fileKey } | ${ rest.join(' | ').replace(`${ nodeId } `, '') }`;
}

export interface GapAppend {
  readonly line: string;
  readonly appended: boolean;
}

export function appendGap(filePath: string, entry: GapEntry): GapAppend {
  const line = formatGapLine(entry);
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  const existing = fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf8').split('\n') : undefined;
  if (existing?.some((candidate) => candidate.startsWith('- ') && missOf(candidate) === missOf(line))) return { line, appended: false };
  const prefix = existing === undefined ? `${ GAP_LOG_HEADER }\n` : '';
  fs.appendFileSync(filePath, `${ prefix }${ line }\n`);
  return { line, appended: true };
}
