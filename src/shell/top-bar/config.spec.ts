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
  it('offers every theme, the system one included, when NEXT_PUBLIC_COLOR_THEMES is not set', async() => {
    const config = await loadConfig([]);

    expect(getThemeIds(config)).toEqual(ALL_THEME_IDS);
    expect(config.colorTheme.default?.id).toBe('system');
  });

  it('offers the system theme only when it is listed next to a light and a dark theme', async() => {
    const config = await loadConfig([ [ 'NEXT_PUBLIC_COLOR_THEMES', '["light","dark","system"]' ] ]);

    expect(getThemeIds(config)).toEqual([ 'light', 'dark', 'system' ]);
  });

  it('hides the system theme when the listed themes are all of one color mode', async() => {
    const config = await loadConfig([ [ 'NEXT_PUBLIC_COLOR_THEMES', '["dim","dark","system"]' ] ]);

    expect(getThemeIds(config)).toEqual([ 'dim', 'dark' ]);
  });

  it('offers every theme when the system theme is the only one listed', async() => {
    const config = await loadConfig([ [ 'NEXT_PUBLIC_COLOR_THEMES', '["system"]' ] ]);

    expect(getThemeIds(config)).toEqual(ALL_THEME_IDS);
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
    expect(config.colorTheme.default?.id).toBe('system');
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

  it('is the system theme when the configured default is system', async() => {
    const config = await loadConfig([
      [ 'NEXT_PUBLIC_COLOR_THEMES', '["light","dark","system"]' ],
      [ 'NEXT_PUBLIC_COLOR_THEME_DEFAULT', 'system' ],
    ]);

    expect(config.colorTheme.default?.id).toBe('system');
  });

  it('is the system theme when the available themes cover both color modes and no default is configured', async() => {
    const config = await loadConfig([ [ 'NEXT_PUBLIC_COLOR_THEMES', '["light","dark","system"]' ] ]);

    expect(config.colorTheme.default?.id).toBe('system');
  });

  it('stays undefined when the available themes cover both color modes but leave the system theme out', async() => {
    const config = await loadConfig([ [ 'NEXT_PUBLIC_COLOR_THEMES', '["light","dark"]' ] ]);

    expect(config.colorTheme.default).toBeUndefined();
  });

  it('stays undefined when every concrete theme is listed explicitly', async() => {
    const config = await loadConfig([ [ 'NEXT_PUBLIC_COLOR_THEMES', '["light","dim","midnight","dark"]' ] ]);

    expect(getThemeIds(config)).toEqual([ 'light', 'dim', 'midnight', 'dark' ]);
    expect(config.colorTheme.default).toBeUndefined();
  });
});
