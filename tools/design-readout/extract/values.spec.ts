import fs from 'fs';
import path from 'path';

import { describe, expect, it } from 'vitest';

import type { FigmaNode, NodeEntry, NodesResponse } from '../fetch/figma';
import { entryOf } from '../fetch/figma';
import { buildThemeColorMap } from '../recognize/colormap';
import type { Extraction, Leaf } from './values';
import { describeLeaf, extractValues, findNode, renderExtraction } from './values';

const MAP = buildThemeColorMap();
const NONE: ReadonlySet<string> = new Set();

function readFixture(file: string, nodeId: string): NodeEntry {
  const payload = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'fixtures', file), 'utf8')) as NodesResponse;
  return entryOf(payload, nodeId);
}

const DARK_ROW = readFixture('22842-178383-dark.json', '22842:178383');

function solid(hex: string, opacity = 1): FigmaNode['fills'] {
  const channel = (offset: number): number => parseInt(hex.slice(offset, offset + 2), 16) / 255;
  return [ { type: 'SOLID', opacity, color: { r: channel(1), g: channel(3), b: channel(5), a: 1 } } ];
}

function node(id: string, type: string, extra: Partial<FigmaNode> = {}, children: Array<FigmaNode> = []): FigmaNode {
  return { id, name: id, type, absoluteBoundingBox: { x: 0, y: 0, width: 10, height: 10 }, children, ...extra };
}

function entryWith(document: FigmaNode, styles: NodeEntry['styles'] = {}, components: NodeEntry['components'] = {}): NodeEntry {
  return { document, styles, components };
}

function extract(entry: NodeEntry, excluded: ReadonlySet<string> = NONE): Extraction {
  return extractValues(entry, [ entry.document ], excluded, MAP);
}

describe('extractValues', () => {
  it('reads a text node from the fixture: content, font, fill per role and box', () => {
    const { leaves } = extract(DARK_ROW);
    expect(leaves.find((leaf) => leaf.id === '22842:178386')).toEqual({
      id: '22842:178386',
      bbox: { x: 1473, y: 869, width: 60, height: 20 },
      values: {
        kind: 'text',
        text: '1248139',
        trailingGlyphs: undefined,
        font: { family: 'Inter', weight: 700, size: 14, lineHeight: 20 },
        colors: [ { role: 'text', hex: '#63B3ED', alpha: 1 } ],
      },
    });
  });

  it('folds the paint opacity into the alpha of a text fill', () => {
    const { leaves } = extract(DARK_ROW);
    const leaf = leaves.find((entry) => entry.id === '22842:178403');
    expect(leaf?.values.colors[0].hex).toBe('#FFFFFF');
    expect(leaf?.values.colors[0].alpha).toBeCloseTo(0.8);
  });

  it('excludes a hidden node and everything under it', () => {
    const { leaves, hints } = extract(DARK_ROW);
    const ids = leaves.map((leaf) => leaf.id);
    expect(ids).not.toContain('22842:178391');
    expect(ids).not.toContain('22842:178390');
    expect(ids).not.toContain('22842:178395');
    expect(hints.map((hint) => hint.nodeId)).not.toContain('22842:178391');
    expect(ids).toEqual([ '22842:178386', '22842:178400', '22842:178403', '22842:178408', '22842:178412' ]);
  });

  it('skips an excluded id and its subtree', () => {
    const { leaves } = extract(DARK_ROW, new Set([ '22842:178401' ]));
    expect(leaves.map((leaf) => leaf.id)).not.toContain('22842:178403');
  });

  it('records a filled and bordered frame as a box with background and border roles, then walks into it', () => {
    const frame = node('frame', 'FRAME', { fills: solid('#1A202C'), strokes: solid('#2D3748') }, [
      node('label', 'TEXT', { characters: 'Hi', fills: solid('#FFFFFF') }),
    ]);
    const { leaves } = extract(entryWith(frame));
    expect(leaves.map((leaf) => leaf.id)).toEqual([ 'frame', 'label' ]);
    expect(leaves[0].values).toEqual({
      kind: 'box',
      colors: [ { role: 'background', hex: '#1A202C', alpha: 1 }, { role: 'border', hex: '#2D3748', alpha: 1 } ],
    });
  });

  it('records a plain structural frame as nothing but walks its children', () => {
    const frame = node('wrap', 'FRAME', { fills: [] }, [ node('label', 'TEXT', { characters: 'x', fills: solid('#000000') }) ]);
    expect(extract(entryWith(frame)).leaves.map((leaf) => leaf.id)).toEqual([ 'label' ]);
  });

  it('records an icon instance by its instance name with the first fill inside as the icon color', () => {
    const icon = node('inst', 'INSTANCE', { name: 'Icons/arrows/east', componentId: 'c1', fills: [] }, [
      node('v', 'VECTOR', { fills: solid('#718096') }),
    ]);
    const { leaves, hints } = extract(entryWith(icon, {}, { c1: { name: 'arrows/east' } }));
    expect(leaves).toEqual([ {
      id: 'inst',
      bbox: { x: 0, y: 0, width: 10, height: 10 },
      values: { kind: 'icon', icon: 'Icons/arrows/east', colors: [ { role: 'icon', hex: '#718096', alpha: 1 } ] },
    } ]);
    expect(hints).toEqual([ {
      nodeId: 'inst',
      layer: 'Icons/arrows/east',
      source: 'component',
      name: 'arrows/east',
      verdict: { kind: 'unchecked', reason: 'a component name is a label, not a value' },
    } ]);
  });

  it('walks into an instance that carries text instead of treating it as an icon', () => {
    const button = node('btn', 'INSTANCE', { name: 'Button', fills: solid('#3182CE') }, [ node('t', 'TEXT', { characters: 'Go', fills: solid('#FFFFFF') }) ]);
    const { leaves } = extract(entryWith(button));
    expect(leaves.map((leaf) => [ leaf.id, leaf.values.kind ])).toEqual([ [ 'btn', 'box' ], [ 't', 'text' ] ]);
  });

  it('splits a trailing glyph off the text content', () => {
    const text = node('t', 'TEXT', { characters: 'Contract ↗', fills: solid('#000000') });
    const { leaves } = extract(entryWith(text));
    expect(leaves[0].values).toMatchObject({ kind: 'text', text: 'Contract ↗', trailingGlyphs: '↗' });
    const truncated = node('h', 'TEXT', { characters: '0x05a3…', fills: solid('#000000') });
    expect(extract(entryWith(truncated)).leaves[0].values).toMatchObject({ trailingGlyphs: '…' });
    const percent = node('p', 'TEXT', { characters: '10.81%', fills: solid('#000000') });
    expect(extract(entryWith(percent)).leaves[0].values).toMatchObject({ trailingGlyphs: undefined });
  });

  it('gives a free-standing vector the icon role', () => {
    const vector = node('v', 'VECTOR', { fills: solid('#F44336') });
    expect(extract(entryWith(vector)).leaves[0].values).toEqual({ kind: 'box', colors: [ { role: 'icon', hex: '#F44336', alpha: 1 } ] });
  });
});

describe('hints', () => {
  function textWithFillStyle(styleName: string, hex: string, opacity = 1): NodeEntry {
    const text = node('t', 'TEXT', { characters: 'x', fills: solid(hex, opacity), styles: { fill: 's1' } });
    return entryWith(text, { s1: { name: styleName, styleType: 'FILL' } });
  }

  it('agrees when the dark-mode text.primary hint sits over a whiteAlpha fill', () => {
    const { hints } = extract(textWithFillStyle('🖤 Dark/text.primary', '#FFFFFF', 0.8));
    expect(hints).toEqual([ { nodeId: 't', layer: 't', source: 'fill style', name: '🖤 Dark/text.primary', verdict: { kind: 'agrees' } } ]);
  });

  it('reports a disagreement with both sides when the hint names a token the value does not serve in the run mode', () => {
    const { hints } = extract(textWithFillStyle('🖤 Dark/text.secondary', '#FFFFFF', 0.8));
    expect(hints[0].verdict).toEqual({ kind: 'disagrees', value: '#FFFFFF/80 → dark: link.menu, link.navigation.fg, text.primary' });
  });

  it('reports a hint stated for the other mode as a disagreement, whatever token it names', () => {
    const { hints, colorMode } = extract(textWithFillStyle('🤍 Light/text.primary', '#FFFFFF', 0.8));
    expect(colorMode.mode).toBe('dark');
    expect(hints[0].verdict).toEqual({
      kind: 'disagrees',
      value: 'stated for light, the run reads dark; #FFFFFF/80 → dark: link.menu, link.navigation.fg, text.primary',
    });
  });

  it('flags the dark button hint over the light-mode link blue of the Details row, a token the theme does not know', () => {
    const { hints, colorMode } = extract(readFixture('22842-169552-light.json', '22842:169552'));
    expect(colorMode).toMatchObject({ mode: 'light', decidedBy: 'majority' });
    expect(hints.find((hint) => hint.nodeId === '22842:169555' && hint.source === 'fill style')).toEqual({
      nodeId: '22842:169555',
      layer: 'Asset Name Copy 2',
      source: 'fill style',
      name: '🖤 Dark/button.primary',
      verdict: { kind: 'disagrees', value: 'stated for dark, the run reads light; #2B6CB0 → light: link.primary' },
    });
    expect(hints.filter((hint) => hint.verdict.kind === 'disagrees')).toHaveLength(1);
  });

  it('checks a mode-free hint in the run mode', () => {
    expect(extract(textWithFillStyle('gray/400', '#A0AEC0')).hints[0].verdict).toEqual({ kind: 'agrees' });
    const { hints } = extract(textWithFillStyle('gray/500', '#A0AEC0'));
    expect(hints[0].verdict).toMatchObject({ kind: 'disagrees', value: expect.stringMatching(/^#A0AEC0 → (light|dark): /) });
  });

  it('leaves a hint unchecked when it names no theme token or the node paints nothing', () => {
    const foreign = extract(textWithFillStyle('💙 Selected options/selected.option.bg', '#3182CE')).hints[0];
    expect(foreign.verdict).toEqual({ kind: 'unchecked', reason: '"Selected options.selected.option.bg" is not a theme token' });
    const unpainted = node('t', 'TEXT', { characters: 'x', fills: [], styles: { fill: 's1' } });
    const { hints } = extract(entryWith(unpainted, { s1: { name: 'Dark/text.primary', styleType: 'FILL' } }));
    expect(hints[0].verdict).toEqual({ kind: 'unchecked', reason: 'the node paints no solid color' });
  });

  it('judges the fixture fill hints in the mode the fills voted for', () => {
    const { hints, colorMode } = extract(DARK_ROW);
    expect(colorMode).toEqual({ mode: 'dark', decidedBy: 'majority', votes: { light: 0, dark: 5 } });
    const fills = hints.filter((hint) => hint.source === 'fill style').map((hint) => [ hint.nodeId, hint.name, hint.verdict.kind ]);
    expect(fills).toEqual([
      [ '22842:178386', '🖤 Dark/link.primary', 'agrees' ],
      [ '22842:178400', '🖤 Dark/text.secondary', 'agrees' ],
      [ '22842:178403', '🖤 Dark/text.primary', 'agrees' ],
      [ '22842:178408', '🖤 Dark/text.primary', 'agrees' ],
      [ '22842:178412', '🖤 Dark/text.primary', 'agrees' ],
    ]);
  });

  it('compares a text style hint to the font values', () => {
    const { hints } = extract(DARK_ROW);
    expect(hints.find((hint) => hint.nodeId === '22842:178386' && hint.source === 'text style')).toEqual({
      nodeId: '22842:178386', layer: 'Asset Name Copy 2', source: 'text style', name: '🔠 Text - Inter/text-sm/font-bold', verdict: { kind: 'agrees' },
    });
    const text = node('t', 'TEXT', {
      characters: 'x',
      fills: solid('#000000'),
      style: { fontFamily: 'Inter', fontWeight: 400, fontSize: 16, lineHeightPx: 24 },
      styles: { text: 's1' },
    });
    const mismatch = extract(entryWith(text, { s1: { name: 'Text - Inter/text-sm/font-bold', styleType: 'TEXT' } })).hints[0];
    expect(mismatch.verdict).toEqual({ kind: 'disagrees', value: 'size 14px vs 16px, weight 700 vs 400' });
    const unknown = extract(entryWith(text, { s1: { name: 'Heading/h1', styleType: 'TEXT' } })).hints[0];
    expect(unknown.verdict).toEqual({ kind: 'unchecked', reason: 'the style name claims no size or weight the tool knows' });
  });

  it('checks a stroke style against the border color', () => {
    const frame = node('f', 'FRAME', { strokes: solid('#E2E8F0'), styles: { stroke: 's1' } }, []);
    const { hints } = extract(entryWith(frame, { s1: { name: 'gray/200', styleType: 'FILL' } }));
    expect(hints).toEqual([ { nodeId: 'f', layer: 'f', source: 'stroke style', name: 'gray/200', verdict: { kind: 'agrees' } } ]);
  });
});

describe('color mode', () => {
  const paletteOnlyText = node('t', 'TEXT', { characters: 'x', fills: solid('#000000') });

  it('breaks a tie between the fills with the linked node\'s own background, even when the regions sit below it', () => {
    const page = node('page', 'FRAME', { fills: solid('#101112') }, [ paletteOnlyText ]);
    const entry = entryWith(page);
    expect(extractValues(entry, [ paletteOnlyText ], NONE, MAP).colorMode)
      .toEqual({ mode: 'dark', decidedBy: 'frame-background', votes: { light: 0, dark: 0 } });
    expect(extract(entry).colorMode).toMatchObject({ mode: 'dark', decidedBy: 'majority' });
  });

  it('reads the light tx row light although its grays paint dark-mode backgrounds: each fill votes with its own role', () => {
    const { colorMode } = extract(readFixture('13983-116369-light.json', '13983:116369'));
    expect(colorMode).toMatchObject({ mode: 'light', decidedBy: 'majority' });
    expect(colorMode.votes.light).toBeGreaterThan(colorMode.votes.dark);
  });

  it('falls back to light when neither the fills nor the linked node\'s background lean either way', () => {
    expect(extract(entryWith(paletteOnlyText)).colorMode).toEqual({ mode: 'light', decidedBy: 'default', votes: { light: 0, dark: 0 } });
  });
});

describe('findNode', () => {
  it('finds a node by id anywhere under the root, or nothing', () => {
    expect(findNode(DARK_ROW.document, '22842:178403')?.name).toBe('Asset Name Copy 2');
    expect(findNode(DARK_ROW.document, '22842:178383')?.id).toBe('22842:178383');
    expect(findNode(DARK_ROW.document, '1:1')).toBeUndefined();
  });
});

describe('renderExtraction', () => {
  it('lists the leaves, then the hints with their verdicts and a disagreement count', () => {
    const entry = textWithTwoHints();
    const rendered = renderExtraction(extract(entry));
    expect(rendered).toBe([
      'Color mode: dark (by majority; 0 light, 1 dark)',
      'Values: 1 leaves',
      '  - t text "Hi ↗" +"↗" — Inter 700 14/20; text #FFFFFF/80',
      'Figma hints (not stored): 2, 1 disagreeing',
      '  - t "t" fill style "Light/text.primary": DISAGREES with value stated for light, the run reads dark; ' +
        '#FFFFFF/80 → dark: link.menu, link.navigation.fg, text.primary',
      '  - t "t" text style "text-sm/font-bold": agrees',
    ].join('\n'));
  });

  it('describes an icon and a box leaf', () => {
    expect(describeLeaf({ id: 'i', bbox: null, values: { kind: 'icon', icon: 'Icons/x', colors: [] } })).toBe('i icon "Icons/x" — ');
    const box: Leaf = { id: 'b', bbox: null, values: { kind: 'box', colors: [ { role: 'border', hex: '#000000', alpha: 0.5 } ] } };
    expect(describeLeaf(box)).toBe('b box — border #000000/50');
    const bare: Leaf = { id: 't', bbox: null, values: { kind: 'text', text: 'x', trailingGlyphs: undefined, font: undefined, colors: [] } };
    expect(describeLeaf(bare)).toBe('t text "x" — no font; ');
  });

  function textWithTwoHints(): NodeEntry {
    const text = node('t', 'TEXT', {
      characters: 'Hi ↗',
      fills: solid('#FFFFFF', 0.8),
      style: { fontFamily: 'Inter', fontWeight: 700, fontSize: 14, lineHeightPx: 20 },
      styles: { fill: 's1', text: 's2' },
    });
    return entryWith(text, { s1: { name: 'Light/text.primary', styleType: 'FILL' }, s2: { name: 'text-sm/font-bold', styleType: 'TEXT' } });
  }
});
