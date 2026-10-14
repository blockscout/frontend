import fs from 'fs';
import path from 'path';

import type { GAP_STAGES } from './config';
import { GAP_LOG_FILE, SIDECAR_DIR } from './config';
import { describeWhy } from './recognize';
import type { Correction, GapCategory, NodeRecord } from './sidecar';
import { describeLeaf } from './values';

export type GapStage = typeof GAP_STAGES[number];

export interface GapEntry {
  readonly date: string;
  readonly fileKey: string;
  readonly nodeId: string;
  readonly gap: GapCategory;
  readonly stage: GapStage;
  readonly toolSaid: string;
  readonly developerSaid: string;
}

export const GAP_LOG_HEADER = '# Design readout gap log — one line per miss: date | file key | node id | category | stage | the tool said | the developer said';

export function gapLogPath(mainCheckout: string): string {
  return path.join(mainCheckout, SIDECAR_DIR, GAP_LOG_FILE);
}

function describeToolSaid(node: NodeRecord): string {
  return `${ node.status }: ${ describeLeaf(node) } — ${ describeWhy(node, node) }`;
}

function describeDeveloperSaid(correction: Correction): string {
  return correction.props.length === 0 ? correction.component : `${ correction.component } ${ correction.props.join(' ') }`;
}

export interface CorrectionGap {
  readonly date: string;
  readonly fileKey: string;
  readonly nodeId: string;
  readonly correction: Correction;
  readonly node: NodeRecord;
}

export function gapOfCorrection({ date, fileKey, nodeId, correction, node }: CorrectionGap): GapEntry {
  return { date, fileKey, nodeId, gap: correction.gap, stage: 'readout', toolSaid: describeToolSaid(node), developerSaid: describeDeveloperSaid(correction) };
}

export interface NoteGap {
  readonly date: string;
  readonly fileKey: string;
  readonly gap: GapCategory;
  readonly text: string;
}

// A note maps to no node: the miss surfaced in the running app, against the agent's markup, and the
// developer could not pin it to one leaf the sidecar holds.
export function gapOfNote({ date, fileKey, gap, text }: NoteGap): GapEntry {
  return { date, fileKey, nodeId: '', gap, stage: 'markup', toolSaid: '', developerSaid: text };
}

export function formatGapLine({ date, fileKey, nodeId, gap, stage, toolSaid, developerSaid }: GapEntry): string {
  return `- ${ date } | ${ fileKey } | ${ nodeId } | ${ gap } | ${ stage } | ${ toolSaid } | ${ developerSaid }`;
}

// A miss is the kind of thing the tool got wrong, not the node it got it wrong on or the stage it
// surfaced at: the same cell repeated down eight rows of a mockup is one miss, so the phase 2 count
// reads kinds. The key is the line without its date, node id and stage.
function missOf(line: string): string {
  const [ , fileKey, nodeId, category, , ...rest ] = line.replace(/^- /, '').split(' | ');
  const said = rest.join(' | ');
  return `${ fileKey } | ${ category } | ${ nodeId === '' ? said : said.replace(`${ nodeId } `, '') }`;
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
