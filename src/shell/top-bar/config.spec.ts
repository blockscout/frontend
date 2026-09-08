// SPDX-License-Identifier: LicenseRef-Blockscout

import { describe, expect, it } from 'vitest';
import withEnvs from 'vitest/utils/mockEnvs';

import type topBarConfig from './config';
import { COLOR_THEMES } from './settings/color-theme/config';

async function loadConfig(envs: Array<[ string, string ]>): Promise<typeof topBarConfig> {
  return withEnvs(envs, async() => (await import('./config')).default);
}

function getThemeIds(config: typeof topBarConfig): Array<string> {
  return config.colorTheme.themes.map((theme) => theme.id);
}

const ALL_THEME_IDS = COLOR_THEMES.map((theme) => theme.id);

describe('color themes', () => {
  it('offers every theme when NEXT_PUBLIC_COLOR_THEMES is not set', async() => {
    const config = await loadConfig([]);

    expect(getThemeIds(config)).toEqual(ALL_THEME_IDS);
    expect(config.colorTheme.default).toBeUndefined();
  });

  it('offers only the configured themes', async() => {
    const config = await loadConfig([ [ 'NEXT_PUBLIC_COLOR_THEMES', '["light","dark"]' ] ]);

    expect(getThemeIds(config)).toEqual([ 'light', 'dark' ]);
  });

  it('keeps the canonical theme order whatever order they are configured in', async() => {
    const config = await loadConfig([ [ 'NEXT_PUBLIC_COLOR_THEMES', '["dark","midnight","light"]' ] ]);

    expect(getThemeIds(config)).toEqual([ 'light', 'midnight', 'dark' ]);
  });

  it('ignores an unknown theme id', async() => {
    const config = await loadConfig([ [ 'NEXT_PUBLIC_COLOR_THEMES', '["light","sepia"]' ] ]);

    expect(getThemeIds(config)).toEqual([ 'light' ]);
  });

  it('offers every theme when nothing in the configured list is a known theme', async() => {
    const config = await loadConfig([ [ 'NEXT_PUBLIC_COLOR_THEMES', '["sepia"]' ] ]);

    expect(getThemeIds(config)).toEqual(ALL_THEME_IDS);
    expect(config.colorTheme.default).toBeUndefined();
  });
});

describe('default color theme', () => {
  it('is the configured default when it is available', async() => {
    const config = await loadConfig([
      [ 'NEXT_PUBLIC_COLOR_THEMES', '["light","dark"]' ],
      [ 'NEXT_PUBLIC_COLOR_THEME_DEFAULT', 'dark' ],
    ]);

    expect(config.colorTheme.default?.id).toBe('dark');
  });

  it('is the configured default when no theme list is configured', async() => {
    const config = await loadConfig([ [ 'NEXT_PUBLIC_COLOR_THEME_DEFAULT', 'midnight' ] ]);

    expect(config.colorTheme.default?.id).toBe('midnight');
  });

  it('is the darkest available theme when only dark themes are available', async() => {
    const config = await loadConfig([ [ 'NEXT_PUBLIC_COLOR_THEMES', '["dim","dark"]' ] ]);

    expect(config.colorTheme.default?.id).toBe('dark');
  });

  it('is the only available theme when a single theme is available', async() => {
    const config = await loadConfig([ [ 'NEXT_PUBLIC_COLOR_THEMES', '["light"]' ] ]);

    expect(config.colorTheme.default?.id).toBe('light');
  });

  it('ignores a configured default that is not available', async() => {
    const config = await loadConfig([
      [ 'NEXT_PUBLIC_COLOR_THEMES', '["dim","midnight"]' ],
      [ 'NEXT_PUBLIC_COLOR_THEME_DEFAULT', 'light' ],
    ]);

    expect(config.colorTheme.default?.id).toBe('midnight');
  });

  it('stays undefined when the available themes cover both color modes', async() => {
    const config = await loadConfig([ [ 'NEXT_PUBLIC_COLOR_THEMES', '["light","dark"]' ] ]);

    expect(config.colorTheme.default).toBeUndefined();
  });

  it('stays undefined when every theme is listed explicitly', async() => {
    const config = await loadConfig([ [ 'NEXT_PUBLIC_COLOR_THEMES', '["light","dim","midnight","dark"]' ] ]);

    expect(getThemeIds(config)).toEqual(ALL_THEME_IDS);
    expect(config.colorTheme.default).toBeUndefined();
  });
});
