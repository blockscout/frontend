import { DEFAULT_THEME_COLORS, PALETTE_COLORS } from '../../../src/toolkit/theme/foundations/colorsDefault';
import { SEMANTIC_TOKENS_DEFAULT } from '../../../src/toolkit/theme/foundations/semanticTokensDefault';
import { COLOR_ROLE_PATTERNS } from '../config';

export type ColorMode = 'light' | 'dark';
export type ColorRole = keyof typeof COLOR_ROLE_PATTERNS;

// A resolved color: six upper-case hex digits plus an alpha in [0, 1], where 1 is opaque.
export interface ColorValue {
  readonly hex: string;
  readonly alpha: number;
}

// hex (with alpha) → token names. Palette names (`blue.500`, `whiteAlpha.800`) are the same in both
// modes; semantic names (`text.primary`, `button.solid.bg`) resolve per mode.
export interface ColorMap {
  readonly palette: Record<string, Array<string>>;
  readonly semantic: Record<ColorMode, Record<string, Array<string>>>;
}

type TokenTree = Record<string, unknown>;

const MODES: ReadonlyArray<ColorMode> = [ 'light', 'dark' ];

// Alpha is keyed as a whole percent: the theme writes two decimals, Figma reports floats like 0.800000011.
const ALPHA_PERCENT = 100;
const OPAQUE_PERCENT = 100;

// `{colors.a.b}` chains are short; the limit only stops a reference cycle from recursing forever.
const MAX_REFERENCE_DEPTH = 10;

function channelHex(channel: number): string {
  return Math.round(channel).toString(16).padStart(2, '0').toUpperCase();
}

export function parseColorLiteral(literal: string): ColorValue | undefined {
  const text = literal.trim();
  const hex = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(text);
  if (hex !== null) {
    const digits = hex[1].length === 3 ? hex[1].split('').map((digit) => digit + digit).join('') : hex[1];
    return { hex: `#${ digits.toUpperCase() }`, alpha: 1 };
  }
  const rgba = /^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+)\s*)?\)$/i.exec(text);
  if (rgba !== null) {
    const [ , red, green, blue, alpha ] = rgba;
    return { hex: `#${ channelHex(Number(red)) }${ channelHex(Number(green)) }${ channelHex(Number(blue)) }`, alpha: alpha === undefined ? 1 : Number(alpha) };
  }
  return undefined;
}

export function colorKey(value: ColorValue): string {
  const percent = Math.round(value.alpha * ALPHA_PERCENT);
  return percent >= OPAQUE_PERCENT ? value.hex.toUpperCase() : `${ value.hex.toUpperCase() }/${ percent }`;
}

function isRecord(value: unknown): value is TokenTree {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function walkPath(tree: TokenTree, segments: ReadonlyArray<string>): unknown {
  let node: unknown = tree;
  for (const segment of segments) {
    if (!isRecord(node)) return undefined;
    node = node[segment];
  }
  return node;
}

interface TokenReference {
  readonly segments: ReadonlyArray<string>;
  readonly alphaScale: number;
}

function parseReference(text: string): TokenReference | undefined {
  const match = /^\{colors\.([^}/]+)(?:\/(\d+))?\}$/.exec(text.trim());
  if (match === null) return undefined;
  return { segments: match[1].split('.'), alphaScale: match[2] === undefined ? 1 : Number(match[2]) / ALPHA_PERCENT };
}

// Where a path lands in the tree: a leaf's `value`, a group's `DEFAULT`, or a theme group keyed by mode.
function valueAt(node: unknown, mode: ColorMode): unknown {
  if (!isRecord(node)) return undefined;
  if ('value' in node) return node.value;
  if (isRecord(node.DEFAULT) && 'value' in node.DEFAULT) return node.DEFAULT.value;
  const forMode = node[`_${ mode }`];
  return isRecord(forMode) ? forMode.value : undefined;
}

function resolveValue(tree: TokenTree, value: unknown, mode: ColorMode, depth: number): ColorValue | undefined {
  if (isRecord(value)) return resolveValue(tree, value[`_${ mode }`], mode, depth);
  if (typeof value !== 'string') return undefined;
  const reference = parseReference(value);
  if (reference === undefined) return parseColorLiteral(value);
  if (depth >= MAX_REFERENCE_DEPTH) return undefined;
  const resolved = resolveValue(tree, valueAt(walkPath(tree, reference.segments), mode), mode, depth + 1);
  return resolved === undefined ? undefined : { hex: resolved.hex, alpha: resolved.alpha * reference.alphaScale };
}

export function resolveToken(tree: TokenTree, value: unknown, mode: ColorMode): ColorValue | undefined {
  return resolveValue(tree, value, mode, 0);
}

interface TokenLeaf {
  readonly name: string;
  readonly value: unknown;
}

// Every `{ value }` leaf under the tree, named by its path the way Chakra names the token: `DEFAULT`
// segments are not part of the name (`tooltip.DEFAULT.bg` is `tooltip.bg`).
function collectLeaves(node: unknown, path: ReadonlyArray<string>, into: Array<TokenLeaf>): void {
  if (!isRecord(node)) return;
  if ('value' in node) {
    into.push({ name: path.filter((segment) => segment !== 'DEFAULT').join('.'), value: node.value });
    return;
  }
  for (const [ key, child ] of Object.entries(node)) {
    collectLeaves(child, [ ...path, key ], into);
  }
}

function addEntry(section: Record<string, Array<string>>, key: string, name: string): void {
  section[key] = [ ...(section[key] ?? []), name ];
}

function sortSection(section: Record<string, Array<string>>): Record<string, Array<string>> {
  return Object.fromEntries(Object.keys(section).sort().map((key) => [ key, [ ...section[key] ].sort() ]));
}

export interface ThemeSources {
  readonly palette: TokenTree;
  readonly themeDefaults: TokenTree;
  readonly semanticColors: TokenTree;
}

// A theme default is mode-keyed by its own path (`theme.stats.bg._light`), so the leaf's last segment
// says which mode it belongs to and the token keeps the rest of the path.
function themeLeafMode(leaf: TokenLeaf): { readonly name: string; readonly mode: ColorMode } | undefined {
  const mode = MODES.find((candidate) => leaf.name.endsWith(`._${ candidate }`));
  return mode === undefined ? undefined : { name: leaf.name.slice(0, -`._${ mode }`.length), mode };
}

export function buildColorMap({ palette, themeDefaults, semanticColors }: ThemeSources): ColorMap {
  const tree: TokenTree = { ...palette, theme: themeDefaults, ...semanticColors };

  const paletteSection: Record<string, Array<string>> = {};
  const paletteLeaves: Array<TokenLeaf> = [];
  collectLeaves(palette, [], paletteLeaves);
  for (const leaf of paletteLeaves) {
    const resolved = resolveToken(tree, leaf.value, 'light');
    if (resolved !== undefined) addEntry(paletteSection, colorKey(resolved), leaf.name);
  }

  const semantic = { light: {}, dark: {} } as Record<ColorMode, Record<string, Array<string>>>;

  const themeLeaves: Array<TokenLeaf> = [];
  collectLeaves(themeDefaults, [ 'theme' ], themeLeaves);
  for (const leaf of themeLeaves) {
    const keyed = themeLeafMode(leaf);
    const resolved = keyed === undefined ? undefined : resolveToken(tree, leaf.value, keyed.mode);
    if (keyed !== undefined && resolved !== undefined) addEntry(semantic[keyed.mode], colorKey(resolved), keyed.name);
  }

  const semanticLeaves: Array<TokenLeaf> = [];
  collectLeaves(semanticColors, [], semanticLeaves);
  for (const mode of MODES) {
    for (const leaf of semanticLeaves) {
      const resolved = resolveToken(tree, leaf.value, mode);
      if (resolved !== undefined) addEntry(semantic[mode], colorKey(resolved), leaf.name);
    }
    semantic[mode] = sortSection(semantic[mode]);
  }

  return { palette: sortSection(paletteSection), semantic };
}

// The map of the shipped theme. Built from the config-free defaults, so an instance's runtime color
// overrides are never in it.
export function buildThemeColorMap(): ColorMap {
  return buildColorMap({ palette: PALETTE_COLORS, themeDefaults: DEFAULT_THEME_COLORS, semanticColors: SEMANTIC_TOKENS_DEFAULT.colors });
}

const NO_TOKENS: ReadonlyArray<string> = [];

function semanticTokensFor(map: ColorMap, value: ColorValue, mode: ColorMode): ReadonlyArray<string> {
  return map.semantic[mode][colorKey(value)] ?? NO_TOKENS;
}

// Every token the color serves in the mode, semantic first; a role keeps only the tokens its patterns name.
export function lookupTokens(map: ColorMap, value: ColorValue, mode: ColorMode, role?: ColorRole): Array<string> {
  const all = [ ...semanticTokensFor(map, value, mode), ...(map.palette[colorKey(value)] ?? NO_TOKENS) ];
  if (role === undefined) return all;
  const patterns: ReadonlyArray<RegExp> = COLOR_ROLE_PATTERNS[role];
  return all.filter((name) => patterns.some((pattern) => pattern.test(name)));
}

export interface ModeDetection {
  readonly mode: ColorMode;
  readonly decidedBy: 'majority' | 'frame-background' | 'default';
  readonly votes: Record<ColorMode, number>;
}

// A fill that votes on the mode; with a role, only that role's tokens count for it.
export interface VotingColor extends ColorValue {
  readonly role?: ColorRole;
}

// The mode a color leans to: the one where it serves more semantic tokens that the other mode does not
// share. A token the color serves in both modes says nothing, and neither do palette names, which are
// mode-free. The role matters: `gray.600` is a light-mode text and a dark-mode background, so a
// text fill of it must not be read as a dark vote.
function leaningMode(map: ColorMap, value: VotingColor): ColorMode | undefined {
  const inLight = lookupTokens(map, value, 'light', value.role);
  const inDark = lookupTokens(map, value, 'dark', value.role);
  const lightOnly = inLight.filter((name) => !inDark.includes(name)).length;
  const darkOnly = inDark.filter((name) => !inLight.includes(name)).length;
  if (lightOnly === darkOnly) return undefined;
  return lightOnly > darkOnly ? 'light' : 'dark';
}

export function detectColorMode(map: ColorMap, values: ReadonlyArray<VotingColor>, frameBackground: VotingColor | undefined): ModeDetection {
  const votes: Record<ColorMode, number> = { light: 0, dark: 0 };
  for (const value of values) {
    const mode = leaningMode(map, value);
    if (mode !== undefined) votes[mode] += 1;
  }
  if (votes.light !== votes.dark) return { mode: votes.light > votes.dark ? 'light' : 'dark', decidedBy: 'majority', votes };

  const background = frameBackground === undefined ? undefined : leaningMode(map, frameBackground);
  if (background !== undefined) return { mode: background, decidedBy: 'frame-background', votes };

  return { mode: 'light', decidedBy: 'default', votes };
}
