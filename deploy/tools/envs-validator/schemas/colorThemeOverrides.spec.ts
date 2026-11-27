// SPDX-License-Identifier: LicenseRef-Blockscout

import { describe, expect, it } from 'vitest';

import { getValidationErrors } from '../utils';
import { colorThemeOverridesSchema, findColorOverrideErrors } from './colorThemeOverrides';

const DEFAULTS = {
  hover: {
    _light: { value: 'blue' },
    _dark: { value: 'blue' },
  },
  button: {
    primary: {
      _light: { value: 'blue' },
      _dark: { value: 'blue' },
      text: {
        _light: { value: 'white' },
        _dark: { value: 'white' },
      },
    },
  },
};

describe('findColorOverrideErrors', () => {
  it('accepts an override of one color mode of a token', () => {
    expect(findColorOverrideErrors({ hover: { _dark: { value: 'red' } } }, DEFAULTS)).toEqual([]);
  });

  it('accepts overrides of a token and of the token nested in it', () => {
    expect(findColorOverrideErrors({
      button: { primary: { _light: { value: 'red' }, text: { _light: { value: 'black' } } } },
    }, DEFAULTS)).toEqual([]);
  });

  it('accepts no overrides', () => {
    expect(findColorOverrideErrors({}, DEFAULTS)).toEqual([]);
  });

  it('rejects a token the defaults do not have, at any depth', () => {
    expect(findColorOverrideErrors({
      hovered: { _light: { value: 'red' } },
      button: { secondary: { _light: { value: 'red' } } },
    }, DEFAULTS)).toEqual([
      'Unknown color token "hovered"',
      'Unknown color token "button.secondary"',
    ]);
  });

  it('rejects a color mode on a group of tokens', () => {
    expect(findColorOverrideErrors({ button: { _light: { value: 'red' } } }, DEFAULTS)).toEqual([
      'Unknown color token "button._light"',
    ]);
  });

  it('rejects a token nested below a color mode', () => {
    expect(findColorOverrideErrors({ hover: { _light: { text: { value: 'red' } } } }, DEFAULTS)).toEqual([
      'Color token "hover._light" must be an object with a non-empty string "value"',
    ]);
  });

  it.each([
    [ 'a bare color', 'red' ],
    [ 'an empty color', { value: '' } ],
    [ 'a non-string color', { value: 1 } ],
    [ 'a list', [ 'red' ] ],
    [ 'null', null ],
  ])('rejects %s as a color mode value', (_, value) => {
    expect(findColorOverrideErrors({ hover: { _light: value } }, DEFAULTS)).toEqual([
      'Color token "hover._light" must be an object with a non-empty string "value"',
    ]);
  });

  it.each([
    [ 'a bare color', 'red' ],
    [ 'a list', [ 'red' ] ],
    [ 'null', null ],
  ])('rejects %s as a token', (_, value) => {
    expect(findColorOverrideErrors({ hover: value }, DEFAULTS)).toEqual([ 'Color token "hover" must be an object' ]);
  });
});

describe('colorThemeOverridesSchema', () => {
  it('accepts overrides of the app default colors', () => {
    expect(getValidationErrors(colorThemeOverridesSchema, {
      bg: { primary: { _light: { value: 'rgba(254,253,253)' }, _dark: { value: 'rgba(25,25,26)' } } },
      button: { primary: { text: { _dark: { value: '#000' } } } },
    })).toEqual([]);
  });

  it('reports every problem of the overrides', () => {
    expect(getValidationErrors(colorThemeOverridesSchema, {
      bg: { tertiary: { _light: { value: 'red' } } },
      text: { primary: { _light: 'red' } },
    })).toEqual([
      'Unknown color token "bg.tertiary"',
      'Color token "text.primary._light" must be an object with a non-empty string "value"',
    ]);
  });

  it('rejects a list of overrides', () => {
    expect(getValidationErrors(colorThemeOverridesSchema, [])).toEqual([ 'Expected a JSON object' ]);
  });
});
