import fs from 'fs';
import path from 'path';

import { ICON_ADJACENCY_GAP_PX, LOOKALIKE_CHARACTERS, SPRITE_NAMES_FILE } from './config';
import type { BoundingBox } from './figma';
import type { Leaf } from './values';
import { describeLeaf } from './values';

export type Entity = 'address' | 'transaction' | 'method' | 'block' | 'batch' | 'epoch' | 'nft' | 'timestamp' | 'ticker';

export type TextShapeSignal =
  'address' | 'transaction-hash' | 'method-id' | 'truncated-hash' | 'number' | 'nft-id' | 'relative-timestamp' | 'absolute-timestamp' | 'ticker';

export interface TextShapeRule {
  readonly signal: TextShapeSignal;
  readonly entities: ReadonlyArray<Entity>;
  readonly pattern: RegExp;
  readonly example: string;
}

const RELATIVE_TIME_UNIT_LETTERS: ReadonlyArray<string> = [ 's', 'm', 'h', 'd', 'w', 'y' ];
const RELATIVE_TIME_UNIT_WORDS: ReadonlyArray<string> = [
  'sec', 'secs', 'second', 'seconds', 'min', 'mins', 'minute', 'minutes', 'hr', 'hrs', 'hour', 'hours',
  'day', 'days', 'week', 'weeks', 'mo', 'month', 'months', 'year', 'years',
];
const RELATIVE_TIME_UNIT = `(?:[${ RELATIVE_TIME_UNIT_LETTERS.join('') }]|${ RELATIVE_TIME_UNIT_WORDS.join('|') })`;

// Each rule matches the whole text after lookalike normalization and with the trailing glyphs cut
// off. The first rule that matches wins, so the specific shapes sit above the general ones; a rule
// with several entities names what the ticket's context must choose between.
export const TEXT_SHAPE_RULES: ReadonlyArray<TextShapeRule> = [
  { signal: 'address', entities: [ 'address' ], pattern: /^0x[0-9a-f]{40}$/i, example: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D' },
  {
    signal: 'transaction-hash',
    entities: [ 'transaction' ],
    pattern: /^0x[0-9a-f]{64}$/i,
    example: '0x6c7d1e0a2b3c4d5e6f708192a3b4c5d6e7f8091a2b3c4d5e6f708192a3b4c5d6',
  },
  { signal: 'method-id', entities: [ 'method' ], pattern: /^0x[0-9a-f]{8}$/i, example: '0xa9059cbb' },
  { signal: 'truncated-hash', entities: [ 'address', 'transaction' ], pattern: /^0x[0-9a-f]{2,}…(?:[0-9a-f]{2,})?$/i, example: '0x05a3…f2d1' },
  { signal: 'nft-id', entities: [ 'nft' ], pattern: /^#\d+(?:…\d+)?$/, example: '#1234' },
  { signal: 'number', entities: [ 'block', 'batch', 'epoch' ], pattern: /^(?:\d{1,3}(?:,\d{3})+|\d+)$/, example: '1248139' },
  {
    signal: 'relative-timestamp',
    entities: [ 'timestamp' ],
    pattern: new RegExp(`^(?:\\d+\\s*${ RELATIVE_TIME_UNIT }\\s*)+ago$`, 'i'),
    example: '10s ago',
  },
  {
    signal: 'absolute-timestamp',
    entities: [ 'timestamp' ],
    pattern: new RegExp([
      '^(?:',
      '\\d{4}-\\d{2}-\\d{2}(?:[T ]\\d{2}:\\d{2}(?::\\d{2})?)?',
      '|[A-Z][a-z]{2} \\d{1,2},? \\d{4}(?: \\d{1,2}:\\d{2}(?::\\d{2})?)?',
      '|\\d{1,2}/\\d{1,2}/\\d{4}(?: \\d{1,2}:\\d{2}(?::\\d{2})?)?',
      ')$',
    ].join('')),
    example: 'Oct 6, 2026 12:34:56',
  },
  { signal: 'ticker', entities: [ 'ticker' ], pattern: /^[A-Z][A-Z0-9]{1,5}$/, example: 'USDT' },
];

const ZERO_WIDTH = /[\u200b-\u200d\ufeff]/g;
const THREE_DOTS = /\.{3}/g;
const TRAILING_SYMBOLS = /[\p{So}\p{Sm}\s]+$/u;

export function normalizeLookalikes(text: string): string {
  return Array.from(text.replace(ZERO_WIDTH, '').replace(THREE_DOTS, '…'))
    .map((character) => LOOKALIKE_CHARACTERS[character] ?? character)
    .join('');
}

export interface TextShapeMatch {
  readonly signal: TextShapeSignal;
  readonly entities: ReadonlyArray<Entity>;
  readonly value: string;
}

export function matchTextShape(text: string): TextShapeMatch | undefined {
  const value = normalizeLookalikes(text).replace(TRAILING_SYMBOLS, '').trim();
  const rule = TEXT_SHAPE_RULES.find((candidate) => candidate.pattern.test(value));
  return rule === undefined ? undefined : { signal: rule.signal, entities: rule.entities, value };
}

const SPRITE_NAME = /"([^"]+)"/g;

export function parseSpriteNames(source: string): ReadonlyArray<string> {
  return Array.from(source.matchAll(SPRITE_NAME), (match) => match[1]);
}

function findRepoRoot(start: string): string {
  let dir = start;
  while (!fs.existsSync(path.join(dir, SPRITE_NAMES_FILE))) {
    const parent = path.dirname(dir);
    if (parent === dir) throw new Error(`Cannot find ${ SPRITE_NAMES_FILE } above ${ start }`);
    dir = parent;
  }
  return dir;
}

// Walks up from this module: the compiled copy runs from `dist/tools/design-readout/`, the specs from
// `tools/design-readout/`, and the repo root is the first ancestor holding the sprite list.
export function loadSpriteNames(): ReadonlyArray<string> {
  return parseSpriteNames(fs.readFileSync(path.join(findRepoRoot(__dirname), SPRITE_NAMES_FILE), 'utf8'));
}

const ICON_GROUP_PREFIX = /^icons?-/;
const VARIANT_PROPERTIES = /,.*$/;
const SIZE_SUFFIX = /-(?:\d+(?:px)?|xs|sm|md|lg|xl|2xl)$/;
const SEPARATORS = /[\s_/-]+/g;

// Lower case, one separator, no `Icons/` group: "Icons/Arrows East" and "arrows/east" are one name.
// The sprite list stays injective under this (`recognize.spec.ts` checks), so no two sprites collide.
export function normalizeIconName(name: string): string {
  return name.trim().toLowerCase().replace(VARIANT_PROPERTIES, '').replace(SEPARATORS, '-').replace(ICON_GROUP_PREFIX, '');
}

export function matchIconName(instanceName: string, spriteNames: ReadonlyArray<string>): string | undefined {
  const bySprite = new Map(spriteNames.map((sprite) => [ normalizeIconName(sprite), sprite ]));
  const normalized = normalizeIconName(instanceName);
  return bySprite.get(normalized) ?? bySprite.get(normalized.replace(SIZE_SUFFIX, ''));
}

export type RecognitionStatus = 'recognized' | 'ambiguous' | 'unrecognized';

// What the signal says the node is: for a text, its shape and the entities that shape can be; for an
// icon, the sprite name its instance name resolved to. Never a component.
export type Decision =
  { readonly signal: TextShapeSignal; readonly value: string; readonly entities: ReadonlyArray<Entity> } |
  { readonly signal: 'icon'; readonly icon: string };

export interface Recognition {
  readonly id: string;
  readonly status: RecognitionStatus;
  readonly decision: Decision | null;
}

function isBeside(a: BoundingBox | null, b: BoundingBox | null): boolean {
  if (a === null || b === null) return false;
  const overlapsVertically = a.y < b.y + b.height && b.y < a.y + a.height;
  const gap = Math.max(a.x - (b.x + b.width), b.x - (a.x + a.width));
  return overlapsVertically && gap <= ICON_ADJACENCY_GAP_PX;
}

function hasIconBeside(leaf: Leaf, leaves: ReadonlyArray<Leaf>): boolean {
  return leaves.some((other) => other.values.kind === 'icon' && isBeside(leaf.bbox, other.bbox));
}

// A truncated hash stands for an entity only with the entity's icon beside it; alone, nothing says
// whether the designer meant an address or a transaction.
function recognizeText(leaf: Leaf, text: string, leaves: ReadonlyArray<Leaf>): Recognition {
  const match = matchTextShape(text);
  if (match === undefined) return { id: leaf.id, status: 'unrecognized', decision: null };
  const ambiguous = match.signal === 'truncated-hash' && !hasIconBeside(leaf, leaves);
  return { id: leaf.id, status: ambiguous ? 'ambiguous' : 'recognized', decision: match };
}

function recognizeIcon(leaf: Leaf, instanceName: string, spriteNames: ReadonlyArray<string>): Recognition {
  const icon = matchIconName(instanceName, spriteNames);
  if (icon === undefined) return { id: leaf.id, status: 'unrecognized', decision: null };
  return { id: leaf.id, status: 'recognized', decision: { signal: 'icon', icon } };
}

function recognizeLeaf(leaf: Leaf, leaves: ReadonlyArray<Leaf>, spriteNames: ReadonlyArray<string>): Recognition {
  const { values } = leaf;
  switch (values.kind) {
    case 'text':
      return recognizeText(leaf, values.text, leaves);
    case 'icon':
      return recognizeIcon(leaf, values.icon, spriteNames);
    case 'box':
      return { id: leaf.id, status: 'unrecognized', decision: null };
  }
}

// One recognition per leaf, in leaf order: text-shape rules first, icon names second; a painted box
// has no text or icon to read and stays unrecognized here.
export function recognize(leaves: ReadonlyArray<Leaf>, spriteNames: ReadonlyArray<string>): ReadonlyArray<Recognition> {
  return leaves.map((leaf) => recognizeLeaf(leaf, leaves, spriteNames));
}

function describeBox(bbox: BoundingBox | null): string {
  return bbox === null ? 'no box' : `at ${ bbox.x },${ bbox.y } ${ bbox.width }×${ bbox.height }`;
}

function describeWhy(leaf: Leaf, recognition: Recognition): string {
  const { decision } = recognition;
  if (decision === null) {
    if (leaf.values.kind === 'icon') return `no sprite icon is named like "${ leaf.values.icon }"`;
    return leaf.values.kind === 'text' ? 'no text-shape rule matches' : 'a painted box has no text or icon to read';
  }
  if (decision.signal === 'icon') return `icon "${ decision.icon }"`;
  return `${ decision.signal }: ${ decision.entities.join(' or ') }${ recognition.status === 'ambiguous' ? ', no icon beside it' : '' }`;
}

function renderList(title: string, leaves: ReadonlyArray<Leaf>, recognitions: ReadonlyArray<Recognition>, status: RecognitionStatus): Array<string> {
  const byId = new Map(leaves.map((leaf) => [ leaf.id, leaf ]));
  const items = recognitions.filter((recognition) => recognition.status === status);
  return [
    `${ title }: ${ items.length }`,
    ...items.map((recognition) => {
      const leaf = byId.get(recognition.id);
      if (leaf === undefined) throw new Error(`Recognition ${ recognition.id } has no leaf.`);
      return `  - ${ describeLeaf(leaf) }; ${ describeBox(leaf.bbox) } — ${ describeWhy(leaf, recognition) }`;
    }),
  ];
}

export function renderRecognition(leaves: ReadonlyArray<Leaf>, recognitions: ReadonlyArray<Recognition>): string {
  const recognized = recognitions.filter((recognition) => recognition.status === 'recognized').length;
  return [
    `Recognized: ${ recognized } of ${ recognitions.length }`,
    ...renderList('Ambiguous', leaves, recognitions, 'ambiguous'),
    ...renderList('Unrecognized', leaves, recognitions, 'unrecognized'),
  ].join('\n');
}
