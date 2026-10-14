import { CHROME_NAMES, SPAN_TOLERANCE_PX } from '../config';
import type { BoundingBox, FigmaNode } from '../fetch/figma';

export interface NodeSummary {
  readonly id: string;
  readonly name: string;
  readonly type: string;
  readonly box: BoundingBox | undefined;
}

export type ChromeRule =
  { readonly kind: 'name'; readonly matched: string } |
  { readonly kind: 'structural'; readonly spans: 'width' | 'height' } |
  { readonly kind: 'wrapper'; readonly inside: ReadonlyArray<string> };

export interface DroppedChrome extends NodeSummary {
  readonly rule: ChromeRule;
  readonly under: NodeSummary;
}

// Hidden layers (visibility off) are not part of the screen and never appear here.
export interface Outline {
  readonly contentRoot: NodeSummary;
  readonly contentChildren: number;
  // The wrappers descended through, outermost first; empty when the linked node is the content root.
  readonly wrappers: ReadonlyArray<NodeSummary>;
  readonly chrome: ReadonlyArray<DroppedChrome>;
}

export function summarize(node: FigmaNode): NodeSummary {
  return { id: node.id, name: node.name, type: node.type, box: node.absoluteBoundingBox ?? undefined };
}

// Separators are dropped rather than collapsed so `topbar_desktop` meets the list's `top bar`.
function normalizeName(name: string): string {
  return name.toLowerCase().replace(/[\s_-]+/g, '');
}

function visibleChildren(node: FigmaNode): Array<FigmaNode> {
  return (node.children ?? []).filter((child) => child.visible !== false);
}

function spans(child: FigmaNode, screen: FigmaNode, side: 'width' | 'height'): boolean {
  const childBox = child.absoluteBoundingBox;
  const screenBox = screen.absoluteBoundingBox;
  if (childBox === undefined || childBox === null || screenBox === undefined || screenBox === null) return false;
  return childBox[side] >= screenBox[side] - SPAN_TOLERANCE_PX;
}

function nameRuleOf(child: FigmaNode): ChromeRule | undefined {
  const name = normalizeName(child.name);
  const matched = CHROME_NAMES.find((chrome) => name.includes(normalizeName(chrome)));
  return matched === undefined ? undefined : { kind: 'name', matched };
}

// Measured against the linked screen, not the immediate parent: an empty-state or a table instance
// fills its column but not the screen, a top bar or a side rail fills the screen.
function structuralRuleOf(child: FigmaNode, screen: FigmaNode): ChromeRule | undefined {
  const isSealedInstance = child.type === 'INSTANCE' && (child.exposedInstances ?? []).length === 0;
  if (!isSealedInstance) return undefined;
  if (spans(child, screen, 'width')) return { kind: 'structural', spans: 'width' };
  if (spans(child, screen, 'height')) return { kind: 'structural', spans: 'height' };
  return undefined;
}

type OwnRule = (child: FigmaNode) => ChromeRule | undefined;

// A node is chrome by its own rule, or because everything visible inside it is chrome (a sidebar
// frame holding the menu and its collapse bar).
function chromeRuleOf(child: FigmaNode, ownRule: OwnRule): ChromeRule | undefined {
  const own = ownRule(child);
  if (own !== undefined) return own;
  const inside = visibleChildren(child);
  if (inside.length === 0 || inside.some((node) => chromeRuleOf(node, ownRule) === undefined)) return undefined;
  return { kind: 'wrapper', inside: inside.map((node) => node.name) };
}

interface Split {
  readonly chrome: ReadonlyArray<DroppedChrome>;
  readonly content: ReadonlyArray<FigmaNode>;
}

function splitChildren(node: FigmaNode, ownRule: OwnRule): Split {
  const chrome: Array<DroppedChrome> = [];
  const content: Array<FigmaNode> = [];
  for (const child of visibleChildren(node)) {
    const rule = chromeRuleOf(child, ownRule);
    if (rule === undefined) content.push(child);
    else chrome.push({ ...summarize(child), rule, under: summarize(node) });
  }
  return { chrome, content };
}

// Inside the content only the name list applies: a spanning instance there is a title or a table.
function chromeWithin(node: FigmaNode): Array<DroppedChrome> {
  const { chrome, content } = splitChildren(node, nameRuleOf);
  return [ ...chrome, ...content.flatMap(chromeWithin) ];
}

// Descend through single-content-child wrappers, dropping chrome at each level, until a node with two
// or more content children (or none); then keep dropping named chrome anywhere inside it.
export function scopeOutline(screen: FigmaNode): Outline {
  const descentRule: OwnRule = (child) => nameRuleOf(child) ?? structuralRuleOf(child, screen);
  const wrappers: Array<NodeSummary> = [];
  const chrome: Array<DroppedChrome> = [];
  let node = screen;
  for (;;) {
    const split = splitChildren(node, descentRule);
    chrome.push(...split.chrome);
    if (split.content.length !== 1) {
      return { contentRoot: summarize(node), contentChildren: split.content.length, wrappers, chrome: [ ...chrome, ...split.content.flatMap(chromeWithin) ] };
    }
    wrappers.push(summarize(node));
    node = split.content[0];
  }
}

function describeBox(box: BoundingBox | undefined): string {
  return box === undefined ? 'no box' : `${ Math.round(box.width) }×${ Math.round(box.height) }`;
}

export function describeNode(node: NodeSummary): string {
  return `${ node.id } "${ node.name }" ${ node.type } ${ describeBox(node.box) }`;
}

function describeRule(rule: ChromeRule): string {
  switch (rule.kind) {
    case 'name':
      return `name contains "${ rule.matched }"`;
    case 'structural':
      return `sealed instance spanning the screen's ${ rule.spans }`;
    case 'wrapper':
      return `holds only chrome (${ rule.inside.join(', ') })`;
  }
}

export function renderOutline(outline: Outline): string {
  const { wrappers, chrome } = outline;
  return [
    `Content root: ${ describeNode(outline.contentRoot) }, ${ outline.contentChildren } content children`,
    `  via: ${ wrappers.length === 0 ? '(the node itself)' : wrappers.map(describeNode).join(' > ') }`,
    'Chrome dropped:',
    ...(chrome.length === 0 ?
      [ '  (none)' ] :
      chrome.map((dropped) => `  - ${ describeNode(dropped) } under ${ dropped.under.id } — ${ describeRule(dropped.rule) }`)),
  ].join('\n');
}
