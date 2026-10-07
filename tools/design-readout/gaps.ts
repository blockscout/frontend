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

export function appendGap(filePath: string, entry: GapEntry): string {
  const line = formatGapLine(entry);
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  const prefix = fs.existsSync(filePath) ? '' : `${ GAP_LOG_HEADER }\n`;
  fs.appendFileSync(filePath, `${ prefix }${ line }\n`);
  return line;
}
