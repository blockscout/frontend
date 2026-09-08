// SPDX-License-Identifier: LicenseRef-Blockscout

import { describe, expect, it } from 'vitest';
import withEnvs from 'vitest/utils/mockEnvs';

import type * as colorThemeUtils from './utils';

async function loadUtils(envs: Array<[ string, string ]>): Promise<typeof colorThemeUtils> {
  return withEnvs(envs, async() => import('./utils'));
}

const LIGHT_ONLY = [ 'NEXT_PUBLIC_COLOR_THEMES', '["light"]' ] satisfies [ string, string ];
const DIM_AND_MIDNIGHT = [ 'NEXT_PUBLIC_COLOR_THEMES', '["dim","midnight"]' ] satisfies [ string, string ];

describe('isColorThemeAvailable', () => {
  it('accepts every theme when no theme list is configured', async() => {
    const { isColorThemeAvailable } = await loadUtils([]);

    expect(isColorThemeAvailable('dim')).toBe(true);
    expect(isColorThemeAvailable('midnight')).toBe(true);
  });

  it('rejects a theme left out of the configured list', async() => {
    const { isColorThemeAvailable } = await loadUtils([ DIM_AND_MIDNIGHT ]);

    expect(isColorThemeAvailable('dim')).toBe(true);
    expect(isColorThemeAvailable('light')).toBe(false);
  });

  it('rejects an unknown theme id', async() => {
    const { isColorThemeAvailable } = await loadUtils([]);

    expect(isColorThemeAvailable('sepia')).toBe(false);
  });
});

describe('getDefaultColorTheme', () => {
  it('picks the darkest theme of the requested color mode', async() => {
    const { getDefaultColorTheme } = await loadUtils([]);

    expect(getDefaultColorTheme('light')).toBe('light');
    expect(getDefaultColorTheme('dark')).toBe('dark');
  });

  it('picks the darkest available theme of the requested color mode', async() => {
    const { getDefaultColorTheme } = await loadUtils([ DIM_AND_MIDNIGHT ]);

    expect(getDefaultColorTheme('dark')).toBe('midnight');
  });

  it('falls back to an available theme when the requested color mode is not available', async() => {
    const { getDefaultColorTheme } = await loadUtils([ LIGHT_ONLY ]);

    expect(getDefaultColorTheme('dark')).toBe('light');
  });
});
