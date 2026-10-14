import fs from 'fs';
import path from 'path';

import { COMPOSITE_ADJACENCY_GAP_PX, ICON_ADJACENCY_GAP_PX, LOOKALIKE_CHARACTERS, SPRITE_NAMES_FILE } from '../config';
import type { Leaf, RoleColor } from '../extract/values';
import { describeLeaf } from '../extract/values';
import type { BoundingBox } from '../fetch/figma';
import { colorKey, lookupTokens } from './colormap';
import type { ColorMap, ColorMode, ColorRole } from './colormap';

export type Entity = 'address' | 'transaction' | 'method' | 'block' | 'batch' | 'epoch' | 'nft' | 'timestamp' | 'ticker' | 'amount';

export type TextShapeSignal =
  'address' | 'transaction-hash' | 'method-id' | 'truncated-hash' | 'number' | 'amount' | 'nft-id' | 'relative-timestamp' | 'absolute-timestamp' |
  'ticker';

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
  { signal: 'amount', entities: [ 'amount' ], pattern: /^(?:\d{1,3}(?:,\d{3})+|\d+)\.\d+$/, example: '0.5612' },
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
      '|[A-Z][a-z]{2} \\d{1,2},? \\d{4}(?: \\d{1,2}:\\d{2}(?::\\d{2})?(?: ?[AP]M)?)?',
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

// Walks up from this module: the compiled copy runs from `dist/tools/design-readout/recognize/`, the
// specs from `tools/design-readout/recognize/`, and the repo root is the first ancestor holding the sprite list.
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

// `recognized`: a signal fired and settles the shape. `ambiguous`: a signal fired but the shape alone
// cannot settle it (a truncated hash with no entity icon beside it). `unrecognized`: nothing fired;
// the values are listed, never a guess.
export type RecognitionStatus = 'recognized' | 'ambiguous' | 'unrecognized';

// What the signal says the node is: for a text, its shape and the entities that shape can be; for an
// icon, the sprite name its instance name resolved to; for a painted box, that every fill is a theme
// token. Never a component.
export type Decision =
  { readonly signal: TextShapeSignal; readonly value: string; readonly entities: ReadonlyArray<Entity> } |
  { readonly signal: 'icon'; readonly icon: string } |
  { readonly signal: 'color' };

// One fill resolved through the reverse map in the run's mode: the tokens it serves under its role,
// empty when none does.
export interface ColorTokens {
  readonly role: ColorRole;
  readonly color: string;
  readonly tokens: ReadonlyArray<string>;
}

export type CompositeSignal = 'from-to' | 'amount-ticker';

// A node's place in a composite: which rule fired, which part it plays, and the ids of every part.
export interface CompositeMembership {
  readonly signal: CompositeSignal;
  readonly part: string;
  readonly members: Readonly<Record<string, string>>;
}

export interface Recognition {
  readonly id: string;
  readonly status: RecognitionStatus;
  readonly decision: Decision | null;
  readonly tokens: ReadonlyArray<ColorTokens>;
  readonly composite: CompositeMembership | null;
}

function isBeside(a: BoundingBox | null, b: BoundingBox | null, maxGap: number): boolean {
  if (a === null || b === null) return false;
  const overlapsVertically = a.y < b.y + b.height && b.y < a.y + a.height;
  const gap = Math.max(a.x - (b.x + b.width), b.x - (a.x + a.width));
  return overlapsVertically && gap <= maxGap;
}

const ARROW_ICON = /^arrows\//;

function isEntityIcon(leaf: Leaf, spriteNames: ReadonlyArray<string>): boolean {
  if (leaf.values.kind !== 'icon') return false;
  const sprite = matchIconName(leaf.values.icon, spriteNames);
  return sprite === undefined || !ARROW_ICON.test(sprite);
}

function hasEntityIconBeside(leaf: Leaf, context: RecognitionContext): boolean {
  return context.leaves.some((other) => isEntityIcon(other, context.spriteNames) && isBeside(leaf.bbox, other.bbox, ICON_ADJACENCY_GAP_PX));
}

type ShapeRecognition = Pick<Recognition, 'status' | 'decision'>;

// A truncated hash stands for an entity only with the entity's icon beside it; alone, or with just
// the arrow to the next hash, nothing says whether the designer meant an address or a transaction.
function recognizeText(leaf: Leaf, text: string, context: RecognitionContext): ShapeRecognition {
  const match = matchTextShape(text);
  if (match === undefined) return { status: 'unrecognized', decision: null };
  const ambiguous = match.signal === 'truncated-hash' && !hasEntityIconBeside(leaf, context);
  return { status: ambiguous ? 'ambiguous' : 'recognized', decision: match };
}

function recognizeIcon(instanceName: string, spriteNames: ReadonlyArray<string>): ShapeRecognition {
  const icon = matchIconName(instanceName, spriteNames);
  if (icon === undefined) return { status: 'unrecognized', decision: null };
  return { status: 'recognized', decision: { signal: 'icon', icon } };
}

// A painted box has no text or icon to read: its fills are all it says, so it is recognized when
// every one of them is a theme token.
function recognizeBox(tokens: ReadonlyArray<ColorTokens>): ShapeRecognition {
  const everyFillIsAToken = tokens.length > 0 && tokens.every((entry) => entry.tokens.length > 0);
  return everyFillIsAToken ? { status: 'recognized', decision: { signal: 'color' } } : { status: 'unrecognized', decision: null };
}

export function resolveTokens(colors: ReadonlyArray<RoleColor>, map: ColorMap, mode: ColorMode): ReadonlyArray<ColorTokens> {
  return colors.map((color) => ({ role: color.role, color: colorKey(color), tokens: lookupTokens(map, color, mode, color.role) }));
}

interface RecognitionContext {
  readonly leaves: ReadonlyArray<Leaf>;
  readonly spriteNames: ReadonlyArray<string>;
  readonly map: ColorMap;
  readonly mode: ColorMode;
}

function recognizeLeaf(leaf: Leaf, context: RecognitionContext): Recognition {
  const { values } = leaf;
  const tokens = resolveTokens(values.colors, context.map, context.mode);
  const shape = ((): ShapeRecognition => {
    switch (values.kind) {
      case 'text':
        return recognizeText(leaf, values.text, context);
      case 'icon':
        return recognizeIcon(values.icon, context.spriteNames);
      case 'box':
        return recognizeBox(tokens);
    }
  })();
  return { id: leaf.id, ...shape, tokens, composite: null };
}

export interface CompositePart {
  readonly part: string;
  readonly matches: (decision: Decision) => boolean;
}

export interface CompositeRule {
  readonly signal: CompositeSignal;
  readonly parts: ReadonlyArray<CompositePart>;
}

const HASH_SIGNALS: ReadonlyArray<string> = [ 'address', 'transaction-hash', 'truncated-hash' ];
const AMOUNT_SIGNALS: ReadonlyArray<string> = [ 'amount', 'number' ];

const isHash = (decision: Decision): boolean => HASH_SIGNALS.includes(decision.signal);
const isArrow = (decision: Decision): boolean => decision.signal === 'icon' && ARROW_ICON.test(decision.icon);
const isAmount = (decision: Decision): boolean => AMOUNT_SIGNALS.includes(decision.signal);
const isTicker = (decision: Decision): boolean => decision.signal === 'ticker';

// The parts in reading order. A rule fires over recognized leaves that sit within the composite gap
// of each other; a leaf that matches none of the parts (the entity icon beside a hash) may sit
// between two parts, a leaf that matches a part out of order ends the attempt, and a part whose
// leaf is only ambiguous blocks the rule — a composite never promotes what the shape could not settle.
export const COMPOSITE_RULES: ReadonlyArray<CompositeRule> = [
  { signal: 'from-to', parts: [ { part: 'from', matches: isHash }, { part: 'arrow', matches: isArrow }, { part: 'to', matches: isHash } ] },
  { signal: 'amount-ticker', parts: [ { part: 'amount', matches: isAmount }, { part: 'ticker', matches: isTicker } ] },
];

interface Member {
  readonly leaf: Leaf;
  readonly recognition: Recognition;
}

// Bounding-box order, not layer order: rows of vertically overlapping boxes top to bottom, left to
// right inside a row. A leaf with no box takes no part in a composite.
export function orderByBox<TItem extends { readonly bbox: BoundingBox | null }>(items: ReadonlyArray<TItem>): Array<TItem> {
  const boxed = items.filter((item) => item.bbox !== null).sort((a, b) => (a.bbox?.y ?? 0) - (b.bbox?.y ?? 0));
  const rows: Array<{ bottom: number; items: Array<TItem> }> = [];
  for (const item of boxed) {
    const box = item.bbox as BoundingBox;
    const row = rows[rows.length - 1];
    if (row !== undefined && box.y < row.bottom) {
      row.items.push(item);
      row.bottom = Math.max(row.bottom, box.y + box.height);
    } else {
      rows.push({ bottom: box.y + box.height, items: [ item ] });
    }
  }
  return rows.flatMap((row) => row.items.sort((a, b) => (a.bbox?.x ?? 0) - (b.bbox?.x ?? 0)));
}

type PartHit = { readonly kind: 'next' } | { readonly kind: 'foreign' } | { readonly kind: 'blocked' };

function classifyMember(member: Member, rule: CompositeRule, nextPart: number, taken: ReadonlySet<string>): PartHit {
  const { decision, status } = member.recognition;
  if (decision === null) return { kind: 'foreign' };
  if (!rule.parts.some((part) => part.matches(decision))) return { kind: 'foreign' };
  const fitsNext = rule.parts[nextPart].matches(decision) && status === 'recognized' && !taken.has(member.leaf.id);
  return fitsNext ? { kind: 'next' } : { kind: 'blocked' };
}

function matchRuleAt(ordered: ReadonlyArray<Member>, start: number, rule: CompositeRule, taken: ReadonlySet<string>): Record<string, string> | undefined {
  const members: Record<string, string> = {};
  let nextPart = 0;
  for (let index = start; index < ordered.length; index++) {
    const member = ordered[index];
    if (index > start && !isBeside(ordered[index - 1].leaf.bbox, member.leaf.bbox, COMPOSITE_ADJACENCY_GAP_PX)) return undefined;
    const hit = classifyMember(member, rule, nextPart, taken);
    if (hit.kind === 'blocked') return undefined;
    if (hit.kind === 'foreign') continue;
    members[rule.parts[nextPart].part] = member.leaf.id;
    nextPart += 1;
    if (nextPart === rule.parts.length) return members;
  }
  return undefined;
}

function withComposite(recognition: Recognition, signal: CompositeSignal, members: Record<string, string>): Recognition {
  const part = Object.keys(members).find((key) => members[key] === recognition.id);
  return part === undefined ? recognition : { ...recognition, composite: { signal, part, members } };
}

// Composites run after every leaf has its own recognition, each rule once over the ordered leaves,
// and a leaf joins at most one composite.
export function applyComposites(leaves: ReadonlyArray<Leaf>, recognitions: ReadonlyArray<Recognition>): ReadonlyArray<Recognition> {
  const byId = new Map(recognitions.map((recognition) => [ recognition.id, recognition ]));
  const ordered = orderByBox(leaves).map((leaf): Member => {
    const recognition = byId.get(leaf.id);
    if (recognition === undefined) throw new Error(`Leaf ${ leaf.id } has no recognition.`);
    return { leaf, recognition };
  });
  const taken = new Set<string>();
  for (const rule of COMPOSITE_RULES) {
    for (let start = 0; start < ordered.length; start++) {
      const members = matchRuleAt(ordered, start, rule, taken);
      if (members === undefined) continue;
      for (const id of Object.values(members)) {
        taken.add(id);
        byId.set(id, withComposite(byId.get(id) as Recognition, rule.signal, members));
      }
    }
  }
  return recognitions.map((recognition) => byId.get(recognition.id) as Recognition);
}

// One recognition per leaf, in leaf order: text-shape rules first, icon names second, every fill
// resolved to its tokens in the run's mode, and the composite rules last over what is recognized.
export function recognize(leaves: ReadonlyArray<Leaf>, spriteNames: ReadonlyArray<string>, map: ColorMap, mode: ColorMode): ReadonlyArray<Recognition> {
  const context: RecognitionContext = { leaves, spriteNames, map, mode };
  return applyComposites(leaves, leaves.map((leaf) => recognizeLeaf(leaf, context)));
}

function describeBox(bbox: BoundingBox | null): string {
  return bbox === null ? 'no box' : `at ${ bbox.x },${ bbox.y } ${ bbox.width }×${ bbox.height }`;
}

function describeUnmapped(tokens: ReadonlyArray<ColorTokens>): string {
  const unmapped = tokens.filter((entry) => entry.tokens.length === 0);
  if (unmapped.length === 0) return 'a painted box has no text or icon to read';
  return `no token serves ${ unmapped.map((entry) => `${ entry.role } ${ entry.color }`).join(', ') }`;
}

export function describeWhy(leaf: Leaf, recognition: Pick<Recognition, 'decision' | 'status' | 'tokens'>): string {
  const { decision } = recognition;
  if (decision === null) {
    if (leaf.values.kind === 'icon') return `no sprite icon is named like "${ leaf.values.icon }"`;
    return leaf.values.kind === 'text' ? 'no text-shape rule matches' : describeUnmapped(recognition.tokens);
  }
  if (decision.signal === 'icon') return `icon "${ decision.icon }"`;
  if (decision.signal === 'color') return 'every fill is a theme token';
  return `${ decision.signal }: ${ decision.entities.join(' or ') }${ recognition.status === 'ambiguous' ? ', no icon beside it' : '' }`;
}

export function describeTokens(tokens: ReadonlyArray<ColorTokens>): string {
  if (tokens.length === 0) return 'no fill';
  return tokens.map((entry) => `${ entry.role } ${ entry.color } → ${ entry.tokens.length === 0 ? 'no token' : entry.tokens.join(', ') }`).join('; ');
}

export function describeComposite(composite: CompositeMembership | null): string {
  if (composite === null) return '';
  const others = Object.entries(composite.members).map(([ part, id ]) => `${ part } ${ id }`).join(', ');
  return `; ${ composite.part } of ${ composite.signal } (${ others })`;
}

function renderList(title: string, leaves: ReadonlyArray<Leaf>, recognitions: ReadonlyArray<Recognition>, status: RecognitionStatus): Array<string> {
  const byId = new Map(leaves.map((leaf) => [ leaf.id, leaf ]));
  const items = recognitions.filter((recognition) => recognition.status === status);
  const detail = (recognition: Recognition): string => `; tokens: ${ describeTokens(recognition.tokens) }${ describeComposite(recognition.composite) }`;
  return [
    `${ title }: ${ items.length }${ status === 'recognized' ? ` of ${ recognitions.length }` : '' }`,
    ...items.map((recognition) => {
      const leaf = byId.get(recognition.id);
      if (leaf === undefined) throw new Error(`Recognition ${ recognition.id } has no leaf.`);
      return `  - ${ describeLeaf(leaf) }; ${ describeBox(leaf.bbox) } — ${ describeWhy(leaf, recognition) }${ detail(recognition) }`;
    }),
  ];
}

export function renderRecognition(leaves: ReadonlyArray<Leaf>, recognitions: ReadonlyArray<Recognition>): string {
  return [
    ...renderList('Recognized', leaves, recognitions, 'recognized'),
    ...renderList('Ambiguous', leaves, recognitions, 'ambiguous'),
    ...renderList('Unrecognized', leaves, recognitions, 'unrecognized'),
  ].join('\n');
}
