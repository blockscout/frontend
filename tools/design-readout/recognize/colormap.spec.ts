import { describe, expect, it } from 'vitest';

import type { ColorMap, ColorValue } from './colormap';
import { buildColorMap, buildThemeColorMap, colorKey, detectColorMode, lookupTokens, parseColorLiteral } from './colormap';

// Built inside each test, not at module level: Stryker activates a mutant only once the tests start.
const themeMap = (): ColorMap => buildThemeColorMap();

const opaque = (hex: string): ColorValue => ({ hex, alpha: 1 });

describe('parseColorLiteral and colorKey', () => {
  it.each([
    [ '#ffffff', '#FFFFFF' ],
    [ '#FFF', '#FFFFFF' ],
    [ 'RGBA(255, 255, 255, 0.80)', '#FFFFFF/80' ],
    [ 'rgba(144, 205, 244, 0.3)', '#90CDF4/30' ],
    [ 'rgba(144, 205, 244, 0)', '#90CDF4/0' ],
    [ 'rgb(16, 17, 18)', '#101112' ],
  ])('%s is keyed as %s', (literal, key) => {
    const value = parseColorLiteral(literal);
    expect(value).toBeDefined();
    expect(colorKey(value as ColorValue)).toBe(key);
  });

  it('keys a Figma float alpha by its whole percent and treats 1 as opaque', () => {
    expect(colorKey({ hex: '#ffffff', alpha: 0.800000011920929 })).toBe('#FFFFFF/80');
    expect(colorKey({ hex: '#ffffff', alpha: 0.999 })).toBe('#FFFFFF');
  });

  it('rejects anything that is not a hex or rgb(a) literal', () => {
    expect(parseColorLiteral('{colors.blue.500}')).toBeUndefined();
    expect(parseColorLiteral('transparent')).toBeUndefined();
  });
});

describe('buildColorMap', () => {
  const palette = {
    blue: { '500': { value: '#3182CE' }, '300': { value: '#63B3ED' } },
    whiteAlpha: { '800': { value: 'RGBA(255, 255, 255, 0.80)' } },
    orange: { '800': { value: '#7B341E' } },
    white: { value: '#ffffff' },
    transparent: { value: 'transparent' },
    list: [ { value: '#111111' } ],
    nothing: null,
  };
  const themeDefaults = {
    text: { primary: { _light: { value: '{colors.blue.500}' }, _dark: { value: '{colors.whiteAlpha.800}' } } },
    link: { primary: { _light: { value: '{colors.blue.500}' }, _dark: { value: '{colors.blue.300}' } } },
    stats: { bg: { _light: { value: '#F7FAFC' }, _dark: { value: '{colors.whiteAlpha.800}' } }, border: { value: '#222222' } },
    ghost: { bg: { _light: { value: 'transparent' } } },
  };
  const semanticColors = {
    text: { primary: { value: { _light: '{colors.theme.text.primary._light}', _dark: '{colors.theme.text.primary._dark}' } } },
    link: { primary: { DEFAULT: { value: { _light: '{colors.theme.link.primary._light}', _dark: '{colors.theme.link.primary._dark}' } } } },
    heading: { DEFAULT: { value: '{colors.text.primary}' } },
    tooltip: { DEFAULT: { fg: { value: '{colors.white}' } } },
    global: { selection: { bg: { value: { _light: '#E3CFE7', _dark: '#754B7D' } } } },
    alert: { bg: { warning: { value: { _light: '{colors.orange.800}', _dark: '{colors.orange.800/44}' } } } },
    nav: { hover: { value: { _light: '{colors.blue.300}' } } },
    viaDefault: { value: '{colors.link.primary}' },
    viaMode: { value: '{colors.theme.stats.bg}' },
    missing: { value: '{colors.nope.deeper.more}' },
    loopA: { value: '{colors.loopB}' },
    loopB: { value: '{colors.loopA}' },
    ...Object.fromEntries(Array.from({ length: 10 }, (_, hop) => [ `chain${ hop }`, { value: `{colors.${ hop === 9 ? 'white' : `chain${ hop + 1 }` }}` } ])),
    chain10: { value: '{colors.chain0}' },
  };
  const build = (): ColorMap => buildColorMap({ palette, themeDefaults, semanticColors });
  const allNames = (map: ColorMap): Array<string> => [ map.palette, map.semantic.light, map.semantic.dark ].flatMap((section) => Object.values(section).flat());

  it('names every palette color by its path, mode-free', () => {
    const map = build();
    expect(map.palette).toEqual({
      '#3182CE': [ 'blue.500' ],
      '#63B3ED': [ 'blue.300' ],
      '#7B341E': [ 'orange.800' ],
      '#FFFFFF': [ 'white' ],
      '#FFFFFF/80': [ 'whiteAlpha.800' ],
    });
  });

  it('resolves references through the theme defaults and other semantic tokens down to hex and alpha, per mode', () => {
    const map = build();
    expect(map.semantic.light['#3182CE']).toEqual([ 'heading', 'link.primary', 'text.primary', 'theme.link.primary', 'theme.text.primary', 'viaDefault' ]);
    expect(map.semantic.dark['#FFFFFF/80']).toEqual([ 'heading', 'text.primary', 'theme.stats.bg', 'theme.text.primary', 'viaMode' ]);
    expect(map.semantic.dark['#63B3ED']).toEqual([ 'link.primary', 'theme.link.primary', 'viaDefault' ]);
    expect(map.semantic.light['#F7FAFC']).toEqual([ 'theme.stats.bg', 'viaMode' ]);
  });

  it('follows a reference chain ten hops deep and gives up on the eleventh, so a cycle resolves to nothing', () => {
    const map = build();
    expect(map.semantic.light['#FFFFFF']).toEqual([ ...Array.from({ length: 10 }, (_, hop) => `chain${ hop }`), 'tooltip.fg' ]);
    expect(allNames(map)).not.toContain('chain10');
    expect(allNames(map)).not.toContain('loopA');
    expect(allNames(map)).not.toContain('loopB');
  });

  it('leaves out a leaf that resolves to no color, a dangling reference, a theme default with no mode, and anything that is not a token tree', () => {
    const names = allNames(build());
    expect(names).not.toContain('transparent');
    expect(names).not.toContain('missing');
    expect(names).not.toContain('theme.stats.border');
    expect(names).not.toContain('theme.ghost.bg');
    expect(names.filter((name) => name.startsWith('list'))).toEqual([]);
    expect(names).not.toContain('nothing');
  });

  it('drops DEFAULT segments, keeps literal hex values and applies a /alpha suffix on a reference', () => {
    const map = build();
    expect(map.semantic.light['#FFFFFF']).toContain('tooltip.fg');
    expect(map.semantic.light['#E3CFE7']).toEqual([ 'global.selection.bg' ]);
    expect(map.semantic.dark['#754B7D']).toEqual([ 'global.selection.bg' ]);
    expect(map.semantic.light['#7B341E']).toEqual([ 'alert.bg.warning' ]);
    expect(map.semantic.dark['#7B341E/44']).toEqual([ 'alert.bg.warning' ]);
  });

  it('leaves a token out of a mode it has no value for', () => {
    const map = build();
    expect(map.semantic.light['#63B3ED']).toEqual([ 'nav.hover' ]);
    expect(map.semantic.dark['#63B3ED']).not.toContain('nav.hover');
  });
});

describe('lookupTokens over the real theme', () => {
  it('returns every token a hex serves, semantic tokens before palette names', () => {
    const tokens = lookupTokens(themeMap(), opaque('#ffffff'), 'light');
    expect(tokens[0]).toBe('bg.primary');
    expect(tokens).toContain('button.solid.text');
    expect(tokens.at(-1)).toBe('white');
  });

  it('resolves the dark-mode rgba(255,255,255,0.8) to whiteAlpha.800 and text.primary', () => {
    const value = parseColorLiteral('rgba(255,255,255,0.8)') as ColorValue;
    const tokens = lookupTokens(themeMap(), value, 'dark');
    expect(tokens).toContain('text.primary');
    expect(tokens).toContain('whiteAlpha.800');
    expect(lookupTokens(themeMap(), value, 'light')).toEqual([ 'whiteAlpha.800' ]);
  });

  it('narrows by role through the token path prefix and misses when the role has no token at that hex', () => {
    expect(lookupTokens(themeMap(), opaque('#ffffff'), 'light', 'background')).toEqual([ 'bg.primary' ]);
    expect(lookupTokens(themeMap(), opaque('#ffffff'), 'light', 'text')).toEqual([]);
    expect(lookupTokens(themeMap(), opaque('#718096'), 'light', 'text')).toEqual([ 'link.secondary', 'text.secondary' ]);
    expect(lookupTokens(themeMap(), opaque('#718096'), 'light', 'icon')).toEqual([ 'icon.primary' ]);
  });

  it('keeps the badge and tag families in the role their leaf names, so a badge fill resolves its color scheme', () => {
    expect(lookupTokens(themeMap(), opaque('#F0FFF4'), 'light', 'background')).toContain('badge.green.bg');
    expect(lookupTokens(themeMap(), opaque('#38A169'), 'light', 'text')).toContain('badge.green.fg');
    expect(lookupTokens(themeMap(), opaque('#38A169'), 'light', 'background')).not.toContain('badge.green.fg');
    expect(lookupTokens(themeMap(), parseColorLiteral('rgba(16,17,18,0.04)') as ColorValue, 'light', 'border')).toContain('tag.root.select.border');
  });

  it('counts a link as a text color unless its path paints a background', () => {
    expect(lookupTokens(themeMap(), opaque('#63B3ED'), 'dark', 'text')).toEqual([ 'link.primary' ]);
    expect(lookupTokens(themeMap(), opaque('#ffffff'), 'light')).toContain('link.navigation.bg.group');
  });

  it('returns nothing for a hex no token serves', () => {
    expect(lookupTokens(themeMap(), opaque('#123456'), 'dark')).toEqual([]);
  });
});

describe('detectColorMode over the real theme', () => {
  const darkText = parseColorLiteral('rgba(255,255,255,0.8)') as ColorValue;
  const lightText = parseColorLiteral('rgba(16,17,18,0.8)') as ColorValue;
  const lightBackground = opaque('#FFFFFF');
  const darkBackground = opaque('#101112');
  const paletteOnly = opaque('#000000');
  const sharedOnly = parseColorLiteral('rgba(144, 205, 244, 0.3)') as ColorValue;
  const balanced = opaque('#6B46C1');

  it('lets the majority of mode-leaning values decide', () => {
    expect(detectColorMode(themeMap(), [ darkText, darkText, lightText ], undefined))
      .toEqual({ mode: 'dark', decidedBy: 'majority', votes: { light: 1, dark: 2 } });
    expect(detectColorMode(themeMap(), [ lightText, lightText, darkText ], lightBackground)).toMatchObject({ mode: 'light', decidedBy: 'majority' });
  });

  it('does not count a color whose exclusive tokens balance, or that serves only shared tokens, palette names, or nothing', () => {
    expect(detectColorMode(themeMap(), [ paletteOnly, sharedOnly, balanced, opaque('#123456'), darkText ], undefined))
      .toMatchObject({ mode: 'dark', votes: { light: 0, dark: 1 } });
  });

  it('lets a fill with a role vote only with that role\'s tokens', () => {
    const gray600 = opaque('#4A5568');
    expect(detectColorMode(themeMap(), [ gray600 ], undefined)).toMatchObject({ mode: 'dark', decidedBy: 'majority' });
    expect(detectColorMode(themeMap(), [ { ...gray600, role: 'text' } ], undefined)).toMatchObject({ mode: 'light', votes: { light: 1, dark: 0 } });
    expect(detectColorMode(themeMap(), [ { ...opaque('#718096'), role: 'text' } ], undefined)).toMatchObject({ mode: 'light', votes: { light: 1, dark: 0 } });
  });

  it('breaks a tie with the frame background', () => {
    expect(detectColorMode(themeMap(), [ darkText, lightText ], darkBackground))
      .toEqual({ mode: 'dark', decidedBy: 'frame-background', votes: { light: 1, dark: 1 } });
    expect(detectColorMode(themeMap(), [], lightBackground)).toMatchObject({ mode: 'light', decidedBy: 'frame-background' });
  });

  it('falls back to light when neither the values nor the background decide', () => {
    expect(detectColorMode(themeMap(), [ paletteOnly ], undefined)).toEqual({ mode: 'light', decidedBy: 'default', votes: { light: 0, dark: 0 } });
    expect(detectColorMode(themeMap(), [], paletteOnly)).toMatchObject({ decidedBy: 'default' });
  });
});
