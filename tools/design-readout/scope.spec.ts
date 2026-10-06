import fs from 'fs';
import path from 'path';

import { describe, expect, it } from 'vitest';

import type { FigmaNode, NodesResponse } from './figma';
import { rootOf } from './figma';
import { renderOutline, scopeOutline } from './scope';

function readFixture(file: string, nodeId: string): FigmaNode {
  const payload = JSON.parse(fs.readFileSync(path.join(__dirname, 'fixtures', file), 'utf8')) as NodesResponse;
  return rootOf(payload, nodeId);
}

interface Box {
  readonly width: number;
  readonly height: number;
}

function node(name: string, box: Box, extra: Partial<FigmaNode> = {}, children: Array<FigmaNode> = []): FigmaNode {
  return {
    id: `${ name }#${ box.width }x${ box.height }`,
    name,
    type: 'FRAME',
    absoluteBoundingBox: { x: 0, y: 0, width: box.width, height: box.height },
    children,
    ...extra,
  };
}

const PAGE: Box = { width: 1440, height: 3000 };

describe('scopeOutline over the captured fixtures', () => {
  it.each([
    [ '22842-174340-light.json', '22842:174340' ],
    [ '22842-178383-dark.json', '22842:178383' ],
  ])('%s: a table row is its own content root; its two hidden cells are not counted', (file, nodeId) => {
    const outline = scopeOutline(readFixture(file, nodeId));
    expect(outline.contentRoot.id).toBe(nodeId);
    expect(outline.contentRoot.name).toBe('Holders_1st_line_public name');
    expect(outline.contentChildren).toBe(5);
    expect(outline.wrappers).toEqual([]);
    expect(outline.chrome).toEqual([]);
  });

  it('prints the root, the path and the dropped chrome, and nothing about hidden layers', () => {
    const text = renderOutline(scopeOutline(readFixture('22842-174340-light.json', '22842:174340')));
    expect(text).toBe([
      'Content root: 22842:174340 "Holders_1st_line_public name" FRAME 1114×46, 5 content children',
      '  via: (the node itself)',
      'Chrome dropped:',
      '  (none)',
    ].join('\n'));
  });
});

describe('scopeOutline descent', () => {
  it('descends single-content-child wrappers and stops at two content children', () => {
    const content = node('Content', { width: 1114, height: 2800 }, {}, [
      node('Header', { width: 1114, height: 60 }),
      node('Table', { width: 1114, height: 2700 }),
    ]);
    const root = node('Page', PAGE, {}, [ node('Wrapper', PAGE, {}, [ content ]) ]);
    const outline = scopeOutline(root);
    expect(outline.contentRoot.id).toBe(content.id);
    expect(outline.contentChildren).toBe(2);
    expect(outline.wrappers.map((wrapper) => wrapper.name)).toEqual([ 'Page', 'Wrapper' ]);
  });

  it('a node without content children is the content root itself', () => {
    const leaf = node('Leaf', { width: 100, height: 20 }, { type: 'TEXT', children: undefined });
    expect(scopeOutline(leaf)).toEqual({
      contentRoot: expect.objectContaining({ id: leaf.id }),
      contentChildren: 0,
      wrappers: [],
      chrome: [],
    });
  });

  it('ignores hidden layers: they neither stop the descent nor count as content', () => {
    const hiddenScreen = node('Error state', PAGE, { visible: false }, [ node('Only', PAGE) ]);
    const hiddenBadge = node('Group 185', { width: 166, height: 40 }, { visible: false });
    const content = node('Content', PAGE, {}, [
      node('A', { width: 1, height: 1 }),
      node('B', { width: 1, height: 1 }),
      node('C', PAGE, { visible: false }),
    ]);
    const outline = scopeOutline(node('Page', PAGE, {}, [ hiddenScreen, hiddenBadge, content ]));
    expect(outline.contentRoot.id).toBe(content.id);
    expect(outline.contentChildren).toBe(2);
    expect(renderOutline(outline)).not.toMatch(/Error state|Group 185|"C"/);
  });

  it('drops chrome by name, ignoring case, whitespace and underscores, and does not count it', () => {
    const table = node('Table', { width: 1114, height: 2700 });
    const root = node('Page', PAGE, {}, [
      node('Search_header', { width: 1114, height: 60 }),
      node('  TOP  bar ', { width: 1114, height: 60 }),
      node('Left Menu', { width: 200, height: 3000 }),
      node('Footer-main', { width: 1114, height: 60 }),
      table,
    ]);
    const outline = scopeOutline(root);
    expect(outline.contentRoot.id).toBe(table.id);
    expect(outline.chrome.map((chrome) => chrome.rule)).toEqual([
      { kind: 'name', matched: 'search header' },
      { kind: 'name', matched: 'top bar' },
      { kind: 'name', matched: 'menu' },
      { kind: 'name', matched: 'footer' },
    ]);
  });

  it('drops a sealed library instance spanning the screen width or height, within tolerance, at any depth', () => {
    const table = node('Table', { width: 1114, height: 2700 });
    const inner = node('Inner', { width: 1114, height: 3000 }, {}, [
      node('Rail', { width: 80, height: 3000 }, { type: 'INSTANCE', exposedInstances: [] }),
      table,
    ]);
    const root = node('Page', { width: 1114, height: 3000 }, {}, [
      node('Banner', { width: 1113.4, height: 60 }, { type: 'INSTANCE' }),
      inner,
    ]);
    const outline = scopeOutline(root);
    expect(outline.contentRoot.id).toBe(table.id);
    expect(outline.chrome.map((chrome) => chrome.rule)).toEqual([
      { kind: 'structural', spans: 'width' },
      { kind: 'structural', spans: 'height' },
    ]);
  });

  it('keeps a sealed instance that fills its column but not the screen, and descends into it', () => {
    const emptyState = node('Verify_empty', { width: 1114, height: 440 }, { type: 'INSTANCE' }, [
      node('Icon', { width: 40, height: 40 }),
      node('Text', { width: 300, height: 20 }),
    ]);
    const column = node('Column', { width: 1114, height: 568 }, {}, [ node('Search_header', { width: 1114, height: 60 }, { type: 'INSTANCE' }), emptyState ]);
    const outline = scopeOutline(node('Page', PAGE, {}, [ node('Menu', { width: 229, height: 832 }), column ]));
    expect(outline.contentRoot.id).toBe(emptyState.id);
    expect(outline.contentChildren).toBe(2);
  });

  it('drops a plain frame that holds nothing but chrome, naming what was inside', () => {
    const sidebar = node('Frame 151', { width: 230, height: 832 }, {}, [
      node('Menu', { width: 229, height: 832 }),
      node('Hide_menu_bar', { width: 1, height: 832 }, { type: 'INSTANCE' }),
      node('Divider', { width: 1, height: 832 }, { visible: false }),
    ]);
    const content = node('Content', { width: 1114, height: 568 }, {}, [ node('A', { width: 1, height: 1 }), node('B', { width: 1, height: 1 }) ]);
    const outline = scopeOutline(node('Page', PAGE, {}, [ sidebar, content ]));
    expect(outline.contentRoot.id).toBe(content.id);
    expect(outline.chrome).toEqual([ expect.objectContaining({ name: 'Frame 151', rule: { kind: 'wrapper', inside: [ 'Menu', 'Hide_menu_bar' ] } }) ]);
    expect(renderOutline(outline)).toContain('— holds only chrome (Menu, Hide_menu_bar)');
  });

  it('matches a chrome name across separators, so topbar_desktop meets "top bar"', () => {
    const content = node('Content', PAGE, {}, [ node('A', { width: 1, height: 1 }), node('B', { width: 1, height: 1 }) ]);
    const outline = scopeOutline(node('Page', PAGE, {}, [ node('topbar_desktop', { width: 1440, height: 32 }, { type: 'INSTANCE' }), content ]));
    expect(outline.chrome.map((chrome) => chrome.rule)).toEqual([ { kind: 'name', matched: 'top bar' } ]);
  });

  it('keeps a spanning instance that exposes children, and a spanning plain frame', () => {
    const root = node('Page', { width: 1114, height: 3000 }, {}, [
      node('Card', { width: 1114, height: 60 }, { type: 'INSTANCE', exposedInstances: [ '1:1' ] }),
      node('Section', { width: 1114, height: 2000 }),
    ]);
    const outline = scopeOutline(root);
    expect(outline.contentRoot.id).toBe(root.id);
    expect(outline.contentChildren).toBe(2);
    expect(outline.chrome).toEqual([]);
  });

  it('keeps dropping named chrome inside the content root, but not spanning instances there', () => {
    const search = node('Search_header', { width: 1283, height: 40 }, { type: 'INSTANCE' });
    const title = node('Tittle/H2', { width: 1283, height: 40 }, { type: 'INSTANCE' });
    const header = node('Frame 567', { width: 1283, height: 104 }, {}, [ search, title ]);
    const table = node('table', { width: 1282, height: 610 }, {}, [
      node('Footer', { width: 1282, height: 20 }),
      node('row', { width: 1282, height: 46 }, { type: 'INSTANCE' }),
    ]);
    const content = node('Content', { width: 1347, height: 858 }, {}, [ header, table ]);
    const outline = scopeOutline(node('Page', PAGE, {}, [ node('Menu', { width: 93, height: 858 }), content ]));
    expect(outline.contentRoot.id).toBe(content.id);
    expect(outline.chrome.map((chrome) => [ chrome.name, chrome.under.name ])).toEqual([
      [ 'Menu', 'Page' ],
      [ 'Search_header', 'Frame 567' ],
      [ 'Footer', 'table' ],
    ]);
  });

  it('prints each dropped chrome with the level it was dropped at and the rule', () => {
    const content = node('Content', { width: 1114, height: 2800 }, {}, [ node('A', { width: 1, height: 1 }), node('B', { width: 1, height: 1 }) ]);
    const inner = node('Inner', { width: 1114, height: 2947 }, {}, [ node('Search_header', { width: 1114, height: 60 }, { type: 'INSTANCE' }), content ]);
    const text = renderOutline(scopeOutline(node('Page', PAGE, {}, [ node('Top bar', { width: 1440, height: 60 }), inner ])));
    expect(text).toContain('via: Page#1440x3000 "Page" FRAME 1440×3000 > Inner#1114x2947 "Inner" FRAME 1114×2947');
    expect(text).toContain('Chrome dropped:\n' +
      '  - Top bar#1440x60 "Top bar" FRAME 1440×60 under Page#1440x3000 — name contains "top bar"\n' +
      '  - Search_header#1114x60 "Search_header" INSTANCE 1114×60 under Inner#1114x2947 — name contains "search header"');
  });
});
