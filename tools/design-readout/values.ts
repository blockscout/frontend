import type { ColorMap, ColorMode, ColorRole, ColorValue, ModeDetection } from './colormap';
import { colorKey, detectColorMode, lookupTokens } from './colormap';
import { TEXT_STYLE_HINT_SIZES_PX, TEXT_STYLE_HINT_WEIGHTS } from './config';
import type { BoundingBox, FigmaNode, FigmaPaint, NodeEntry } from './figma';

export interface RoleColor extends ColorValue {
  readonly role: ColorRole;
}

export interface FontValues {
  readonly family: string | undefined;
  readonly weight: number | undefined;
  readonly size: number | undefined;
  readonly lineHeight: number | undefined;
}

// `text`: a text layer. `icon`: a library instance with no text inside, named by the instance.
// `box`: anything else that paints — a filled or bordered frame, a vector, a shape.
export type LeafValues =
  {
    readonly kind: 'text';
    readonly text: string;
    readonly trailingGlyphs: string | undefined;
    readonly font: FontValues | undefined;
    readonly colors: ReadonlyArray<RoleColor>;
  } |
  { readonly kind: 'icon'; readonly icon: string; readonly colors: ReadonlyArray<RoleColor> } |
  { readonly kind: 'box'; readonly colors: ReadonlyArray<RoleColor> };

export interface Leaf {
  readonly id: string;
  readonly values: LeafValues;
  readonly bbox: BoundingBox | null;
}

export type HintVerdict =
  { readonly kind: 'agrees' } |
  { readonly kind: 'disagrees'; readonly value: string } |
  { readonly kind: 'unchecked'; readonly reason: string };

export type HintSource = 'fill style' | 'stroke style' | 'text style' | 'component';

// What Figma says about a node beside its values. Printed for the developer, never stored.
export interface Hint {
  readonly nodeId: string;
  readonly layer: string;
  readonly source: HintSource;
  readonly name: string;
  readonly verdict: HintVerdict;
}

export interface Extraction {
  readonly leaves: ReadonlyArray<Leaf>;
  readonly hints: ReadonlyArray<Hint>;
  readonly colorMode: ModeDetection;
}

const ICON_SHAPES: ReadonlySet<string> = new Set([ 'VECTOR', 'BOOLEAN_OPERATION', 'STAR', 'POLYGON', 'LINE' ]);
const BOX_SHAPES: ReadonlySet<string> = new Set([ 'RECTANGLE', 'ELLIPSE' ]);
const MODES: ReadonlyArray<ColorMode> = [ 'light', 'dark' ];
const CHANNEL_MAX = 255;

// Arrows, check marks, an ellipsis: what a designer appends to a value rather than part of it. `%`
// and currency signs are punctuation of the value itself and stay in the text.
const TRAILING_GLYPHS = /([\p{So}\p{Sm}…]+)\s*$/u;

function channelHex(channel: number): string {
  return Math.round(channel * CHANNEL_MAX).toString(16).padStart(2, '0').toUpperCase();
}

function solidColor(paint: FigmaPaint, nodeOpacity: number): ColorValue | undefined {
  if (paint.type !== 'SOLID' || paint.visible === false || paint.color === undefined) return undefined;
  const { r, g, b, a } = paint.color;
  return { hex: `#${ channelHex(r) }${ channelHex(g) }${ channelHex(b) }`, alpha: a * (paint.opacity ?? 1) * nodeOpacity };
}

function roleColors(paints: ReadonlyArray<FigmaPaint> | undefined, role: ColorRole, nodeOpacity: number): Array<RoleColor> {
  return (paints ?? []).flatMap((paint) => {
    const color = solidColor(paint, nodeOpacity);
    return color === undefined ? [] : [ { role, ...color } ];
  });
}

function visibleChildren(node: FigmaNode): ReadonlyArray<FigmaNode> {
  return (node.children ?? []).filter((child) => child.visible !== false);
}

function hasVisibleText(node: FigmaNode): boolean {
  return visibleChildren(node).some((child) => child.type === 'TEXT' || hasVisibleText(child));
}

// The first solid fill painted anywhere inside an icon instance is what the icon shows in.
function iconColors(node: FigmaNode): Array<RoleColor> {
  const own = roleColors(node.fills, 'icon', node.opacity ?? 1);
  if (own.length > 0) return own;
  for (const child of visibleChildren(node)) {
    const inside = iconColors(child);
    if (inside.length > 0) return inside;
  }
  return [];
}

function fontOf(node: FigmaNode): FontValues | undefined {
  const style = node.style;
  if (style === undefined) return undefined;
  return { family: style.fontFamily, weight: style.fontWeight, size: style.fontSize, lineHeight: style.lineHeightPx };
}

function textValues(node: FigmaNode): LeafValues {
  const text = node.characters ?? '';
  const glyphs = TRAILING_GLYPHS.exec(text);
  return {
    kind: 'text',
    text,
    trailingGlyphs: glyphs === null ? undefined : glyphs[1],
    font: fontOf(node),
    colors: roleColors(node.fills, 'text', node.opacity ?? 1),
  };
}

function paintedValues(node: FigmaNode, fillRole: ColorRole): LeafValues | undefined {
  const opacity = node.opacity ?? 1;
  const colors = [ ...roleColors(node.fills, fillRole, opacity), ...roleColors(node.strokes, 'border', opacity) ];
  return colors.length === 0 ? undefined : { kind: 'box', colors };
}

function leafValuesOf(node: FigmaNode): LeafValues | undefined {
  if (node.type === 'TEXT') return textValues(node);
  if (node.type === 'INSTANCE' && !hasVisibleText(node)) return { kind: 'icon', icon: node.name, colors: iconColors(node) };
  if (ICON_SHAPES.has(node.type)) return paintedValues(node, 'icon');
  return paintedValues(node, 'background');
}

function isWalkedInto(node: FigmaNode, values: LeafValues | undefined): boolean {
  return values?.kind !== 'text' && values?.kind !== 'icon' && !ICON_SHAPES.has(node.type) && !BOX_SHAPES.has(node.type);
}

interface StyleHintName {
  readonly mode: ColorMode | undefined;
  readonly token: string | undefined;
}

// `🖤 Dark/text.primary` → dark `text.primary`; `gray/200` → `gray.200` in either mode.
function parseStyleHintName(name: string): StyleHintName {
  const segments = name.replace(/[^\x20-\x7E]/g, '').split('/').map((segment) => segment.trim()).filter((segment) => segment !== '');
  const head = segments[0]?.toLowerCase();
  const mode = head === 'light' || head === 'dark' ? head : undefined;
  const rest = mode === undefined ? segments : segments.slice(1);
  return { mode, token: rest.length === 0 ? undefined : rest.join('.') };
}

function isKnownToken(map: ColorMap, token: string): boolean {
  const serves = (index: Record<string, Array<string>>): boolean => Object.values(index).some((tokens) => tokens.includes(token));
  return serves(map.palette) || MODES.some((mode) => serves(map.semantic[mode]));
}

function describeTokens(map: ColorMap, value: RoleColor, mode: ColorMode): string {
  const tokens = lookupTokens(map, value, mode, value.role);
  return `${ colorKey(value) } → ${ mode }: ${ tokens.length === 0 ? `no ${ value.role } token` : tokens.join(', ') }`;
}

// A hint stated for the other mode disagrees before its token is looked at: the file mixes light and
// dark styles, and a dark style on a light screen is the designer's slip whatever token it names.
function colorHintVerdict(map: ColorMap, runMode: ColorMode, name: string, value: RoleColor | undefined): HintVerdict {
  if (value === undefined) return { kind: 'unchecked', reason: 'the node paints no solid color' };
  const { mode, token } = parseStyleHintName(name);
  if (mode !== undefined && mode !== runMode) {
    return { kind: 'disagrees', value: `stated for ${ mode }, the run reads ${ runMode }; ${ describeTokens(map, value, runMode) }` };
  }
  if (token === undefined) return { kind: 'unchecked', reason: 'the style name carries no token' };
  if (!isKnownToken(map, token)) return { kind: 'unchecked', reason: `"${ token }" is not a theme token` };
  if (lookupTokens(map, value, runMode).includes(token)) return { kind: 'agrees' };
  return { kind: 'disagrees', value: describeTokens(map, value, runMode) };
}

interface TextHintClaim {
  readonly size: number | undefined;
  readonly weight: number | undefined;
}

function parseTextHintName(name: string): TextHintClaim {
  const size = /\btext-(\w+)/.exec(name)?.[1];
  const weight = /\bfont-(\w+)/.exec(name)?.[1];
  return {
    size: size === undefined ? undefined : TEXT_STYLE_HINT_SIZES_PX[size.toLowerCase()],
    weight: weight === undefined ? undefined : TEXT_STYLE_HINT_WEIGHTS[weight.toLowerCase()],
  };
}

function textHintVerdict(name: string, font: FontValues | undefined): HintVerdict {
  const claim = parseTextHintName(name);
  if (claim.size === undefined && claim.weight === undefined) return { kind: 'unchecked', reason: 'the style name claims no size or weight the tool knows' };
  if (font === undefined) return { kind: 'unchecked', reason: 'the node has no text style' };
  const mismatches: Array<string> = [];
  if (claim.size !== undefined && claim.size !== font.size) mismatches.push(`size ${ claim.size }px vs ${ font.size ?? '?' }px`);
  if (claim.weight !== undefined && claim.weight !== font.weight) mismatches.push(`weight ${ claim.weight } vs ${ font.weight ?? '?' }`);
  return mismatches.length === 0 ? { kind: 'agrees' } : { kind: 'disagrees', value: mismatches.join(', ') };
}

// A hint with the value it is judged against; the verdict waits for the run's color mode, which the
// leaves decide only once they are all collected.
interface PendingHint {
  readonly nodeId: string;
  readonly layer: string;
  readonly source: HintSource;
  readonly name: string;
  readonly against:
    { readonly kind: 'color'; readonly value: RoleColor | undefined } |
    { readonly kind: 'font'; readonly font: FontValues | undefined } |
    { readonly kind: 'label' };
}

interface WalkContext {
  readonly entry: NodeEntry;
  readonly excluded: ReadonlySet<string>;
  readonly leaves: Array<Leaf>;
  readonly pending: Array<PendingHint>;
}

function styleName(entry: NodeEntry, node: FigmaNode, property: string): string | undefined {
  const id = node.styles?.[property];
  return id === undefined ? undefined : entry.styles?.[id]?.name;
}

function firstColor(values: LeafValues | undefined, role: ColorRole): RoleColor | undefined {
  return values?.colors.find((color) => color.role === role);
}

function fillRoleOf(node: FigmaNode, values: LeafValues | undefined): ColorRole {
  if (values?.kind === 'text') return 'text';
  if (values?.kind === 'icon' || ICON_SHAPES.has(node.type)) return 'icon';
  return 'background';
}

function collectHints(node: FigmaNode, values: LeafValues | undefined, context: WalkContext): void {
  const { entry, pending } = context;
  const hint = (source: HintSource, name: string | undefined, against: PendingHint['against']): void => {
    if (name !== undefined) pending.push({ nodeId: node.id, layer: node.name, source, name, against });
  };
  hint('fill style', styleName(entry, node, 'fill'), { kind: 'color', value: firstColor(values, fillRoleOf(node, values)) });
  hint('stroke style', styleName(entry, node, 'stroke'), { kind: 'color', value: firstColor(values, 'border') });
  hint('text style', styleName(entry, node, 'text'), { kind: 'font', font: fontOf(node) });
  const component = node.componentId === undefined ? undefined : entry.components?.[node.componentId]?.name;
  hint('component', component, { kind: 'label' });
}

function judgeHint(pending: PendingHint, map: ColorMap, mode: ColorMode): Hint {
  const { against, ...hint } = pending;
  switch (against.kind) {
    case 'color':
      return { ...hint, verdict: colorHintVerdict(map, mode, hint.name, against.value) };
    case 'font':
      return { ...hint, verdict: textHintVerdict(hint.name, against.font) };
    case 'label':
      return { ...hint, verdict: { kind: 'unchecked', reason: 'a component name is a label, not a value' } };
  }
}

// The linked node's own fill is the screen background. It is also a leaf when the node is a region,
// so the tiebreak only matters for regions narrower than the node.
function frameBackground(root: FigmaNode): ColorValue | undefined {
  return roleColors(root.fills, 'background', root.opacity ?? 1)[0];
}

function walk(node: FigmaNode, context: WalkContext): void {
  if (node.visible === false || context.excluded.has(node.id)) return;
  const values = leafValuesOf(node);
  collectHints(node, values, context);
  if (values !== undefined) context.leaves.push({ id: node.id, values, bbox: node.absoluteBoundingBox ?? null });
  if (!isWalkedInto(node, values)) return;
  for (const child of node.children ?? []) walk(child, context);
}

export function findNode(root: FigmaNode, id: string): FigmaNode | undefined {
  if (root.id === id) return root;
  for (const child of root.children ?? []) {
    const found = findNode(child, id);
    if (found !== undefined) return found;
  }
  return undefined;
}

// Values per leaf under each region, in document order; hidden layers and excluded ids (dropped
// chrome) are skipped with their subtrees. Every fill of every leaf votes on the color mode, and
// the hints are judged in the mode the vote settled on.
export function extractValues(entry: NodeEntry, regions: ReadonlyArray<FigmaNode>, excluded: ReadonlySet<string>, map: ColorMap): Extraction {
  const context: WalkContext = { entry, excluded, leaves: [], pending: [] };
  for (const region of regions) walk(region, context);
  const { leaves, pending } = context;
  const colorMode = detectColorMode(map, leaves.flatMap((leaf) => leaf.values.colors), frameBackground(entry.document));
  return { leaves, hints: pending.map((hint) => judgeHint(hint, map, colorMode.mode)), colorMode };
}

function describeColors(colors: ReadonlyArray<RoleColor>): string {
  return colors.map((color) => `${ color.role } ${ colorKey(color) }`).join(', ');
}

function describeFont(font: FontValues | undefined): string {
  if (font === undefined) return 'no font';
  return `${ font.family ?? '?' } ${ font.weight ?? '?' } ${ font.size ?? '?' }/${ font.lineHeight ?? '?' }`;
}

export function describeLeaf(leaf: Leaf): string {
  const { values } = leaf;
  switch (values.kind) {
    case 'text': {
      const glyphs = values.trailingGlyphs === undefined ? '' : ` +"${ values.trailingGlyphs }"`;
      return `${ leaf.id } text ${ JSON.stringify(values.text) }${ glyphs } — ${ describeFont(values.font) }; ${ describeColors(values.colors) }`;
    }
    case 'icon':
      return `${ leaf.id } icon "${ values.icon }" — ${ describeColors(values.colors) }`;
    case 'box':
      return `${ leaf.id } box — ${ describeColors(values.colors) }`;
  }
}

function describeVerdict(verdict: HintVerdict): string {
  switch (verdict.kind) {
    case 'agrees':
      return 'agrees';
    case 'disagrees':
      return `DISAGREES with value ${ verdict.value }`;
    case 'unchecked':
      return `unchecked (${ verdict.reason })`;
  }
}

function describeDecidedBy(decidedBy: ModeDetection['decidedBy']): string {
  switch (decidedBy) {
    case 'majority':
      return 'by majority';
    case 'frame-background':
      return 'a tie, by the frame background';
    case 'default':
      return 'no vote, the default';
  }
}

export function describeColorMode({ mode, decidedBy, votes }: ModeDetection): string {
  return `Color mode: ${ mode } (${ describeDecidedBy(decidedBy) }; ${ votes.light } light, ${ votes.dark } dark)`;
}

export function renderExtraction(extraction: Extraction): string {
  const { leaves, hints, colorMode } = extraction;
  const disagreements = hints.filter((hint) => hint.verdict.kind === 'disagrees').length;
  return [
    describeColorMode(colorMode),
    `Values: ${ leaves.length } leaves`,
    ...leaves.map((leaf) => `  - ${ describeLeaf(leaf) }`),
    `Figma hints (not stored): ${ hints.length }, ${ disagreements } disagreeing`,
    ...hints.map((hint) => `  - ${ hint.nodeId } "${ hint.layer }" ${ hint.source } "${ hint.name }": ${ describeVerdict(hint.verdict) }`),
  ].join('\n');
}
