import { describe, expect, it } from 'vitest';

import { buildThemeColorMap } from './colormap';
import type { Recognition } from './recognize';
import {
  COMPOSITE_RULES, loadSpriteNames, matchIconName, matchTextShape, normalizeIconName, normalizeLookalikes, orderByBox, parseSpriteNames, recognize,
  renderRecognition, TEXT_SHAPE_RULES,
} from './recognize';
import type { Leaf, RoleColor } from './values';

const SPRITES: ReadonlyArray<string> = [ 'arrows/east', 'apps_list', 'clock-light', 'gas_xl', 'gas', 'status/success', 'contracts/verified' ];
const MAP = buildThemeColorMap();
const NO_COLORS: ReadonlyArray<RoleColor> = [];

function text(id: string, characters: string, x = 0, y = 0, colors = NO_COLORS): Leaf {
  return {
    id,
    bbox: { x, y, width: 60, height: 20 },
    values: { kind: 'text', text: characters, trailingGlyphs: undefined, font: undefined, colors },
  };
}

function icon(id: string, name: string, x = 0, y = 0): Leaf {
  return { id, bbox: { x, y, width: 20, height: 20 }, values: { kind: 'icon', icon: name, colors: [] } };
}

function box(id: string, colors: ReadonlyArray<RoleColor>, x = 0, y = 0): Leaf {
  return { id, bbox: { x, y, width: 40, height: 20 }, values: { kind: 'box', colors } };
}

function recognizeDark(leaves: ReadonlyArray<Leaf>): ReadonlyArray<Recognition> {
  return recognize(leaves, SPRITES, MAP, 'dark');
}

describe('normalizeLookalikes', () => {
  it('maps Cyrillic and Greek homoglyphs to ASCII and leaves ASCII alone', () => {
    expect(normalizeLookalikes('0х05а3…')).toBe('0x05a3…');
    expect(normalizeLookalikes('ЕТН')).toBe('ETH');
    expect(normalizeLookalikes('0x05a3')).toBe('0x05a3');
  });

  it('folds three dots into an ellipsis and drops zero-width and non-breaking spacing', () => {
    expect(normalizeLookalikes('0x05a3...f2d1')).toBe('0x05a3…f2d1');
    expect(normalizeLookalikes('10s ago​')).toBe('10s ago');
  });
});

describe('TEXT_SHAPE_RULES', () => {
  it('documents each rule with an example its own pattern matches and no earlier rule claims', () => {
    const claimed = TEXT_SHAPE_RULES.map((rule) => [ rule.signal, rule.pattern.test(rule.example), matchTextShape(rule.example)?.signal ]);
    expect(claimed).toEqual(TEXT_SHAPE_RULES.map((rule) => [ rule.signal, true, rule.signal ]));
  });
});

describe('matchTextShape', () => {
  it('tells an address, a transaction hash and a method id apart by length', () => {
    expect(matchTextShape('0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D')).toMatchObject({ signal: 'address', entities: [ 'address' ] });
    expect(matchTextShape(`0x${ 'ab'.repeat(32) }`)).toMatchObject({ signal: 'transaction-hash', entities: [ 'transaction' ] });
    expect(matchTextShape('0xa9059cbb')).toMatchObject({ signal: 'method-id', entities: [ 'method' ] });
  });

  it('reads a truncated hash as an address or a transaction, in either ellipsis form', () => {
    expect(matchTextShape('0x05a3…f2d1')).toMatchObject({ signal: 'truncated-hash', entities: [ 'address', 'transaction' ] });
    expect(matchTextShape('0x05a3f2d1…')?.signal).toBe('truncated-hash');
    expect(matchTextShape('0x05a3...f2d1')?.signal).toBe('truncated-hash');
  });

  it('matches through a lookalike character and records the normalized value', () => {
    expect(matchTextShape('0х05а3…f2d1')).toEqual({ signal: 'truncated-hash', entities: [ 'address', 'transaction' ], value: '0x05a3…f2d1' });
  });

  it('reads a bare or grouped integer as a block, batch or epoch number and a # id as an NFT id', () => {
    expect(matchTextShape('1248139')).toMatchObject({ signal: 'number', entities: [ 'block', 'batch', 'epoch' ] });
    expect(matchTextShape('1,248,139')?.signal).toBe('number');
    expect(matchTextShape('0.5612')).toMatchObject({ signal: 'amount', entities: [ 'amount' ] });
    expect(matchTextShape('1,234.56')?.signal).toBe('amount');
    expect(matchTextShape('#1234')).toMatchObject({ signal: 'nft-id', entities: [ 'nft' ] });
    expect(matchTextShape('#1234…890')?.signal).toBe('nft-id');
  });

  it('reads relative and absolute timestamps', () => {
    expect(matchTextShape('10s ago')).toMatchObject({ signal: 'relative-timestamp', entities: [ 'timestamp' ] });
    expect(matchTextShape('1d 4h ago')?.signal).toBe('relative-timestamp');
    expect(matchTextShape('2 hours ago')?.signal).toBe('relative-timestamp');
    expect(matchTextShape('Oct 6, 2026 12:34:56')).toMatchObject({ signal: 'absolute-timestamp' });
    expect(matchTextShape('2026-10-06 12:34')?.signal).toBe('absolute-timestamp');
  });

  it('reads a short upper-case word as a ticker', () => {
    expect(matchTextShape('USDT')).toMatchObject({ signal: 'ticker', entities: [ 'ticker' ] });
    expect(matchTextShape('Eth')).toBeUndefined();
  });

  it('ignores the trailing glyphs and matches nothing for prose or an amount', () => {
    expect(matchTextShape('0xa9059cbb ↗')?.signal).toBe('method-id');
    expect(matchTextShape('$0.56')).toBeUndefined();
    expect(matchTextShape('Contract')).toBeUndefined();
    expect(matchTextShape('0x05a3')).toBeUndefined();
  });
});

describe('parseSpriteNames / loadSpriteNames', () => {
  it('reads the quoted members of the generated union', () => {
    expect(parseSpriteNames('export type IconName =\n\t| "ABI"\n\t| "arrows/east";\n')).toEqual([ 'ABI', 'arrows/east' ]);
  });

  it('loads the tracked sprite list of this repo, and no two of its names normalize alike', () => {
    const names = loadSpriteNames();
    expect(names).toContain('arrows/east');
    expect(names.length).toBeGreaterThan(100);
    expect(new Set(names.map(normalizeIconName)).size).toBe(names.length);
  });
});

describe('matchIconName', () => {
  it('hits an instance named exactly like a sprite', () => {
    expect(matchIconName('arrows/east', SPRITES)).toBe('arrows/east');
    expect(matchIconName('gas_xl', SPRITES)).toBe('gas_xl');
  });

  it('hits through case, separators, the Icons/ group and a trailing size or variant', () => {
    expect(matchIconName('Icons/Arrows East', SPRITES)).toBe('arrows/east');
    expect(matchIconName('Apps list', SPRITES)).toBe('apps_list');
    expect(matchIconName('clock_light', SPRITES)).toBe('clock-light');
    expect(matchIconName('arrows/east-20', SPRITES)).toBe('arrows/east');
    expect(matchIconName('status/success, Size=sm', SPRITES)).toBe('status/success');
    expect(matchIconName('gas xl', SPRITES)).toBe('gas_xl');
    expect(matchIconName('gas/xl', SPRITES)).toBe('gas_xl');
  });

  it('misses a name no sprite carries', () => {
    expect(matchIconName('Icons/Sparkle', SPRITES)).toBeUndefined();
    expect(matchIconName('arrows', SPRITES)).toBeUndefined();
  });
});

describe('recognize', () => {
  it('runs text shapes first and icon names second, recording the signal on each decision', () => {
    const leaves = [ text('t', '1248139'), icon('i', 'Icons/contracts/verified', 100, 100), text('p', '$0.56') ];
    expect(recognizeDark(leaves)).toEqual<Array<Recognition>>([
      { id: 't', status: 'recognized', decision: { signal: 'number', value: '1248139', entities: [ 'block', 'batch', 'epoch' ] }, tokens: [], composite: null },
      { id: 'i', status: 'recognized', decision: { signal: 'icon', icon: 'contracts/verified' }, tokens: [], composite: null },
      { id: 'p', status: 'unrecognized', decision: null, tokens: [], composite: null },
    ]);
  });

  it('marks a truncated hash ambiguous when no icon sits beside it, recognized when one does', () => {
    const alone = recognizeDark([ text('h', '0x05a3…f2d1') ]);
    expect(alone[0]).toMatchObject({ status: 'ambiguous', decision: { signal: 'truncated-hash' } });
    const beside = recognizeDark([ icon('i', 'contracts/verified', 0, 0), text('h', '0x05a3…f2d1', 28, 0) ]);
    expect(beside.map((recognition) => recognition.status)).toEqual([ 'recognized', 'recognized' ]);
    const farAway = recognizeDark([ icon('i', 'contracts/verified', 0, 0), text('h', '0x05a3…f2d1', 60, 0) ]);
    expect(farAway[1].status).toBe('ambiguous');
    const otherRow = recognizeDark([ icon('i', 'contracts/verified', 0, 0), text('h', '0x05a3…f2d1', 28, 40) ]);
    expect(otherRow[1].status).toBe('ambiguous');
  });

  it('leaves an icon no sprite matches unrecognized', () => {
    expect(recognizeDark([ icon('i', 'Icons/Sparkle') ])).toEqual([ { id: 'i', status: 'unrecognized', decision: null, tokens: [], composite: null } ]);
  });

  it('resolves every fill to the tokens of its role in the run mode, several when the hex serves several', () => {
    const primary = text('t', 'Hi', 0, 0, [ { role: 'text', hex: '#FFFFFF', alpha: 0.8 } ]);
    expect(recognize([ primary ], SPRITES, MAP, 'dark')[0].tokens).toEqual([
      { role: 'text', color: '#FFFFFF/80', tokens: [ 'link.menu', 'link.navigation.fg', 'text.primary' ] },
    ]);
    expect(recognize([ primary ], SPRITES, MAP, 'light')[0].tokens).toEqual([ { role: 'text', color: '#FFFFFF/80', tokens: [] } ]);
  });

  it('recognizes a painted box when every fill is a token and leaves it unrecognized with the unmapped hex otherwise', () => {
    const card = box('c', [ { role: 'background', hex: '#101112', alpha: 1 }, { role: 'border', hex: '#FFFFFF', alpha: 0.06 } ]);
    const [ recognized ] = recognizeDark([ card ]);
    expect(recognized).toMatchObject({ status: 'recognized', decision: { signal: 'color' } });
    expect(recognized.tokens[0]).toEqual({ role: 'background', color: '#101112', tokens: [ 'bg.primary' ] });
    expect(recognized.tokens[1]).toMatchObject({ role: 'border', color: '#FFFFFF/6', tokens: expect.arrayContaining([ 'border.divider' ]) });
    const stray = box('s', [ { role: 'background', hex: '#123456', alpha: 1 }, { role: 'border', hex: '#FFFFFF', alpha: 0.06 } ]);
    expect(recognizeDark([ stray ])[0]).toMatchObject({
      status: 'unrecognized',
      decision: null,
      tokens: [ { color: '#123456', tokens: [] }, { color: '#FFFFFF/6' } ],
    });
  });
});

describe('COMPOSITE_RULES', () => {
  it('is a table of two rules in reading order: hash, arrow, hash and amount, ticker', () => {
    expect(COMPOSITE_RULES.map((rule) => [ rule.signal, rule.parts.map((part) => part.part) ])).toEqual([
      [ 'from-to', [ 'from', 'arrow', 'to' ] ],
      [ 'amount-ticker', [ 'amount', 'ticker' ] ],
    ]);
  });
});

describe('orderByBox', () => {
  it('orders rows of overlapping boxes top to bottom and each row left to right, dropping unboxed items', () => {
    const items = [ text('c', '', 100, 2), text('d', '', 0, 40), text('a', '', 0, 0), { id: 'n', bbox: null }, text('b', '', 50, 10) ];
    expect(orderByBox(items).map((item) => item.id)).toEqual([ 'a', 'b', 'c', 'd' ]);
  });
});

describe('composites', () => {
  const fromTo = [
    icon('fi', 'contracts/verified', 0, 0), text('from', '0x05a3…f2d1', 28, 0), icon('arrow', 'arrows/east', 96, 0),
    icon('ti', 'contracts/verified', 124, 0), text('to', '0x9b1c…0a77', 152, 0),
  ];

  it('joins hash, arrow, hash into a from/to pair over the entity icons between them, in box order not layer order', () => {
    const recognitions = recognizeDark([ ...fromTo ].reverse());
    const members = { from: 'from', arrow: 'arrow', to: 'to' };
    expect(recognitions.find((entry) => entry.id === 'from')?.composite).toEqual({ signal: 'from-to', part: 'from', members });
    expect(recognitions.find((entry) => entry.id === 'arrow')?.composite).toEqual({ signal: 'from-to', part: 'arrow', members });
    expect(recognitions.find((entry) => entry.id === 'to')?.composite).toEqual({ signal: 'from-to', part: 'to', members });
    expect(recognitions.find((entry) => entry.id === 'fi')?.composite).toBeNull();
  });

  it('does not fire when a member is only ambiguous, missing, out of order or too far away', () => {
    const head = fromTo.slice(0, 3);
    const noIcon = recognizeDark([ ...head, text('to', '0x9b1c…0a77', 124, 0) ]);
    expect(noIcon.find((entry) => entry.id === 'to')?.status).toBe('ambiguous');
    expect(noIcon.every((entry) => entry.composite === null)).toBe(true);
    const noArrow = recognizeDark(fromTo.filter((leaf) => leaf.id !== 'arrow'));
    expect(noArrow.every((entry) => entry.composite === null)).toBe(true);
    const twoArrows = recognizeDark([
      ...head, icon('arrow2', 'arrows/east', 124, 0), icon('ti', 'contracts/verified', 152, 0), text('to', '0x9b1c…0a77', 180, 0),
    ]);
    expect(twoArrows.every((entry) => entry.composite === null)).toBe(true);
    const farApart = recognizeDark([ ...head, icon('ti', 'contracts/verified', 200, 0), text('to', '0x9b1c…0a77', 228, 0) ]);
    expect(farApart.every((entry) => entry.composite === null)).toBe(true);
  });

  it('joins an amount or a bare number with the ticker beside it, once per leaf', () => {
    const recognitions = recognizeDark([ text('v', '0.5612', 0, 0), text('c', 'ETH', 64, 0), text('n', '1248139', 0, 30), text('c2', 'USDT', 64, 30) ]);
    expect(recognitions.map((entry) => entry.composite)).toEqual([
      { signal: 'amount-ticker', part: 'amount', members: { amount: 'v', ticker: 'c' } },
      { signal: 'amount-ticker', part: 'ticker', members: { amount: 'v', ticker: 'c' } },
      { signal: 'amount-ticker', part: 'amount', members: { amount: 'n', ticker: 'c2' } },
      { signal: 'amount-ticker', part: 'ticker', members: { amount: 'n', ticker: 'c2' } },
    ]);
    const label = recognizeDark([ text('v', '0.5612', 0, 0), text('l', 'Value', 64, 0), text('c', 'ETH', 128, 0) ]);
    expect(label.map((entry) => entry.composite?.part ?? null)).toEqual([ 'amount', null, 'ticker' ]);
  });
});

describe('renderRecognition', () => {
  it('lists the recognized items with tokens and composites, then the ambiguous and unrecognized items with id, values and box', () => {
    const leaves = [
      text('t', '1248139', 10, 20, [ { role: 'text', hex: '#63B3ED', alpha: 1 } ]), text('h', '0x05a3…f2d1', 80, 20), icon('i', 'Icons/Sparkle', 180, 20),
      text('p', '$0.56', 220, 20), text('v', '0.5612', 10, 50), text('c', 'ETH', 80, 50),
      box('b', [ { role: 'background', hex: '#123456', alpha: 1 } ], 10, 80),
    ];
    expect(renderRecognition(leaves, recognizeDark(leaves))).toBe([
      'Recognized: 3 of 7',
      '  - t text "1248139" — no font; text #63B3ED; at 10,20 60×20 — number: block or batch or epoch; tokens: text #63B3ED → link.primary',
      '  - v text "0.5612" — no font; ; at 10,50 60×20 — amount: amount; tokens: no fill; amount of amount-ticker (amount v, ticker c)',
      '  - c text "ETH" — no font; ; at 80,50 60×20 — ticker: ticker; tokens: no fill; ticker of amount-ticker (amount v, ticker c)',
      'Ambiguous: 1',
      '  - h text "0x05a3…f2d1" — no font; ; at 80,20 60×20 — truncated-hash: address or transaction, no icon beside it; tokens: no fill',
      'Unrecognized: 3',
      '  - i icon "Icons/Sparkle" — ; at 180,20 20×20 — no sprite icon is named like "Icons/Sparkle"; tokens: no fill',
      '  - p text "$0.56" — no font; ; at 220,20 60×20 — no text-shape rule matches; tokens: no fill',
      '  - b box — background #123456; at 10,80 40×20 — no token serves background #123456; tokens: background #123456 → no token',
    ].join('\n'));
  });
});
