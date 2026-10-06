import { describe, expect, it } from 'vitest';

import type { ColorValue } from './colormap';
import { buildColorMap, buildThemeColorMap, colorKey, detectColorMode, lookupTokens, parseColorLiteral } from './colormap';

const THEME_MAP = buildThemeColorMap();

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
  };
  const themeDefaults = {
    text: { primary: { _light: { value: '{colors.blue.500}' }, _dark: { value: '{colors.whiteAlpha.800}' } } },
    link: { primary: { _light: { value: '{colors.blue.500}' }, _dark: { value: '{colors.blue.300}' } } },
    stats: { bg: { _light: { value: '#F7FAFC' }, _dark: { value: '{colors.whiteAlpha.800}' } } },
  };
  const semanticColors = {
    text: { primary: { value: { _light: '{colors.theme.text.primary._light}', _dark: '{colors.theme.text.primary._dark}' } } },
    link: { primary: { DEFAULT: { value: { _light: '{colors.theme.link.primary._light}', _dark: '{colors.theme.link.primary._dark}' } } } },
    heading: { DEFAULT: { value: '{colors.text.primary}' } },
    tooltip: { DEFAULT: { fg: { value: '{colors.white}' } } },
    global: { selection: { bg: { value: { _light: '#E3CFE7', _dark: '#754B7D' } } } },
    alert: { bg: { warning: { value: { _light: '{colors.orange.800}', _dark: '{colors.orange.800/44}' } } } },
    nav: { hover: { value: { _light: '{colors.blue.300}' } } },
  };
  const map = buildColorMap({ palette, themeDefaults, semanticColors });

  it('names every palette color by its path, mode-free', () => {
    expect(map.palette).toEqual({
      '#3182CE': [ 'blue.500' ],
      '#63B3ED': [ 'blue.300' ],
      '#7B341E': [ 'orange.800' ],
      '#FFFFFF': [ 'white' ],
      '#FFFFFF/80': [ 'whiteAlpha.800' ],
    });
  });

  it('resolves references through the theme defaults and other semantic tokens down to hex and alpha, per mode', () => {
    expect(map.semantic.light['#3182CE']).toEqual([ 'heading', 'link.primary', 'text.primary', 'theme.link.primary', 'theme.text.primary' ]);
    expect(map.semantic.dark['#FFFFFF/80']).toEqual([ 'heading', 'text.primary', 'theme.stats.bg', 'theme.text.primary' ]);
    expect(map.semantic.dark['#63B3ED']).toEqual([ 'link.primary', 'theme.link.primary' ]);
  });

  it('drops DEFAULT segments, keeps literal hex values and applies a /alpha suffix on a reference', () => {
    expect(map.semantic.light['#FFFFFF']).toEqual([ 'tooltip.fg' ]);
    expect(map.semantic.light['#E3CFE7']).toEqual([ 'global.selection.bg' ]);
    expect(map.semantic.dark['#754B7D']).toEqual([ 'global.selection.bg' ]);
    expect(map.semantic.light['#7B341E']).toEqual([ 'alert.bg.warning' ]);
    expect(map.semantic.dark['#7B341E/44']).toEqual([ 'alert.bg.warning' ]);
  });

  it('leaves a token out of a mode it has no value for', () => {
    expect(map.semantic.light['#63B3ED']).toEqual([ 'nav.hover' ]);
    expect(map.semantic.dark['#63B3ED']).not.toContain('nav.hover');
  });
});

describe('lookupTokens over the real theme', () => {
  it('returns every token a hex serves, semantic tokens before palette names', () => {
    const tokens = lookupTokens(THEME_MAP, opaque('#ffffff'), 'light');
    expect(tokens[0]).toBe('bg.primary');
    expect(tokens).toContain('button.solid.text');
    expect(tokens.at(-1)).toBe('white');
  });

  it('resolves the dark-mode rgba(255,255,255,0.8) to whiteAlpha.800 and text.primary', () => {
    const value = parseColorLiteral('rgba(255,255,255,0.8)') as ColorValue;
    const tokens = lookupTokens(THEME_MAP, value, 'dark');
    expect(tokens).toContain('text.primary');
    expect(tokens).toContain('whiteAlpha.800');
    expect(lookupTokens(THEME_MAP, value, 'light')).toEqual([ 'whiteAlpha.800' ]);
  });

  it('narrows by role through the token path prefix and misses when the role has no token at that hex', () => {
    expect(lookupTokens(THEME_MAP, opaque('#ffffff'), 'light', 'background')).toEqual([ 'bg.primary' ]);
    expect(lookupTokens(THEME_MAP, opaque('#ffffff'), 'light', 'text')).toEqual([]);
    expect(lookupTokens(THEME_MAP, opaque('#718096'), 'light', 'text')).toEqual([ 'text.secondary' ]);
    expect(lookupTokens(THEME_MAP, opaque('#718096'), 'light', 'icon')).toEqual([ 'icon.primary' ]);
  });

  it('returns nothing for a hex no token serves', () => {
    expect(lookupTokens(THEME_MAP, opaque('#123456'), 'dark')).toEqual([]);
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
    expect(detectColorMode(THEME_MAP, [ darkText, darkText, lightText ], undefined))
      .toEqual({ mode: 'dark', decidedBy: 'majority', votes: { light: 1, dark: 2 } });
    expect(detectColorMode(THEME_MAP, [ lightText, lightText, darkText ], lightBackground)).toMatchObject({ mode: 'light', decidedBy: 'majority' });
  });

  it('does not count a color whose exclusive tokens balance, or that serves only shared tokens, palette names, or nothing', () => {
    expect(detectColorMode(THEME_MAP, [ paletteOnly, sharedOnly, balanced, opaque('#123456'), darkText ], undefined))
      .toMatchObject({ mode: 'dark', votes: { light: 0, dark: 1 } });
  });

  it('breaks a tie with the frame background', () => {
    expect(detectColorMode(THEME_MAP, [ darkText, lightText ], darkBackground))
      .toEqual({ mode: 'dark', decidedBy: 'frame-background', votes: { light: 1, dark: 1 } });
    expect(detectColorMode(THEME_MAP, [], lightBackground)).toMatchObject({ mode: 'light', decidedBy: 'frame-background' });
  });

  it('falls back to light when neither the values nor the background decide', () => {
    expect(detectColorMode(THEME_MAP, [ paletteOnly ], undefined)).toEqual({ mode: 'light', decidedBy: 'default', votes: { light: 0, dark: 0 } });
    expect(detectColorMode(THEME_MAP, [], paletteOnly)).toMatchObject({ decidedBy: 'default' });
  });
});
