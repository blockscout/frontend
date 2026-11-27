// SPDX-License-Identifier: LicenseRef-Blockscout

import * as v from 'valibot';

import { DEFAULT_THEME_COLORS } from 'src/toolkit/theme/foundations/colorsDefault';

import { jsonRecord } from '../utils';

type ColorTree = Record<string, unknown>;

const COLOR_MODE_KEYS: ReadonlyArray<string> = [ '_light', '_dark' ];

const isColorTree = (value: unknown): value is ColorTree => typeof value === 'object' && value !== null && !Array.isArray(value);

const isColorModeKey = (key: string): boolean => COLOR_MODE_KEYS.includes(key);

const hasColorModes = (tree: ColorTree): boolean => COLOR_MODE_KEYS.some((key) => key in tree);

const isColorModeValue = (value: unknown): boolean => isColorTree(value) && typeof value.value === 'string' && value.value !== '';

function findColorModeErrors(tokenPath: string, value: unknown, defaults: ColorTree): Array<string> {
  if (!hasColorModes(defaults)) {
    return [ `Unknown color token "${ tokenPath }"` ];
  }
  return isColorModeValue(value) ? [] : [ `Color token "${ tokenPath }" must be an object with a non-empty string "value"` ];
}

function findNestedErrors(tokenPath: string, value: unknown, defaults: unknown): Array<string> {
  if (!isColorTree(defaults)) {
    return [ `Unknown color token "${ tokenPath }"` ];
  }
  return isColorTree(value) ? findColorOverrideErrors(value, defaults, tokenPath) : [ `Color token "${ tokenPath }" must be an object` ];
}

// The app merges the overrides under the default colors, so a key the defaults do not have is never read:
// a mistyped token name changes nothing on the page and is reported here instead.
export function findColorOverrideErrors(overrides: ColorTree, defaults: ColorTree = DEFAULT_THEME_COLORS, parentPath = ''): Array<string> {
  return Object.entries(overrides).flatMap(([ key, value ]) => {
    const tokenPath = parentPath ? `${ parentPath }.${ key }` : key;
    return isColorModeKey(key) ?
      findColorModeErrors(tokenPath, value, defaults) :
      findNestedErrors(tokenPath, value, defaults[key]);
  });
}

export const colorThemeOverridesSchema = v.pipe(
  jsonRecord(v.unknown()),
  v.rawCheck(({ dataset, addIssue }) => {
    if (dataset.typed) {
      findColorOverrideErrors(dataset.value).forEach((message) => addIssue({ message }));
    }
  }),
);
