import { describe, expect, it } from 'vitest';

import type { Recognition } from './recognize';
import {
  loadSpriteNames, matchIconName, matchTextShape, normalizeIconName, normalizeLookalikes, parseSpriteNames, recognize, renderRecognition,
  TEXT_SHAPE_RULES,
} from './recognize';
import type { Leaf } from './values';

const SPRITES: ReadonlyArray<string> = [ 'arrows/east', 'apps_list', 'clock-light', 'gas_xl', 'gas', 'status/success', 'contracts/verified' ];

function text(id: string, characters: string, x = 0, y = 0): Leaf {
  return {
    id,
    bbox: { x, y, width: 60, height: 20 },
    values: { kind: 'text', text: characters, trailingGlyphs: undefined, font: undefined, colors: [] },
  };
}

function icon(id: string, name: string, x = 0, y = 0): Leaf {
  return { id, bbox: { x, y, width: 20, height: 20 }, values: { kind: 'icon', icon: name, colors: [] } };
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
    expect(recognize(leaves, SPRITES)).toEqual<Array<Recognition>>([
      { id: 't', status: 'recognized', decision: { signal: 'number', value: '1248139', entities: [ 'block', 'batch', 'epoch' ] } },
      { id: 'i', status: 'recognized', decision: { signal: 'icon', icon: 'contracts/verified' } },
      { id: 'p', status: 'unrecognized', decision: null },
    ]);
  });

  it('marks a truncated hash ambiguous when no icon sits beside it, recognized when one does', () => {
    const alone = recognize([ text('h', '0x05a3…f2d1') ], SPRITES);
    expect(alone[0]).toMatchObject({ status: 'ambiguous', decision: { signal: 'truncated-hash' } });
    const beside = recognize([ icon('i', 'contracts/verified', 0, 0), text('h', '0x05a3…f2d1', 28, 0) ], SPRITES);
    expect(beside.map((recognition) => recognition.status)).toEqual([ 'recognized', 'recognized' ]);
    const farAway = recognize([ icon('i', 'contracts/verified', 0, 0), text('h', '0x05a3…f2d1', 60, 0) ], SPRITES);
    expect(farAway[1].status).toBe('ambiguous');
    const otherRow = recognize([ icon('i', 'contracts/verified', 0, 0), text('h', '0x05a3…f2d1', 28, 40) ], SPRITES);
    expect(otherRow[1].status).toBe('ambiguous');
  });

  it('leaves an icon no sprite matches and a painted box unrecognized', () => {
    const box: Leaf = { id: 'b', bbox: null, values: { kind: 'box', colors: [ { role: 'background', hex: '#FFFFFF', alpha: 1 } ] } };
    expect(recognize([ icon('i', 'Icons/Sparkle'), box ], SPRITES)).toEqual([
      { id: 'i', status: 'unrecognized', decision: null },
      { id: 'b', status: 'unrecognized', decision: null },
    ]);
  });
});

describe('renderRecognition', () => {
  it('ends with the recognized count and the ambiguous and unrecognized items with id, values and box', () => {
    const leaves = [ text('t', '1248139', 10, 20), text('h', '0x05a3…f2d1', 80, 20), icon('i', 'Icons/Sparkle', 180, 20), text('p', '$0.56', 220, 20) ];
    expect(renderRecognition(leaves, recognize(leaves, SPRITES))).toBe([
      'Recognized: 1 of 4',
      'Ambiguous: 1',
      '  - h text "0x05a3…f2d1" — no font; ; at 80,20 60×20 — truncated-hash: address or transaction, no icon beside it',
      'Unrecognized: 2',
      '  - i icon "Icons/Sparkle" — ; at 180,20 20×20 — no sprite icon is named like "Icons/Sparkle"',
      '  - p text "$0.56" — no font; ; at 220,20 60×20 — no text-shape rule matches',
    ].join('\n'));
  });
});
