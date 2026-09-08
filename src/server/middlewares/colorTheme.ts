// SPDX-License-Identifier: LicenseRef-Blockscout

import type { NextRequest, NextResponse } from 'next/server';

import { getDefaultColorTheme, isColorThemeAvailable } from 'src/shell/top-bar/settings/color-theme/utils';

import appConfig from 'src/config';
import * as cookiesLib from 'src/shared/storage/cookies';

import type { ColorMode } from 'src/toolkit/chakra/color-mode';

export default function colorThemeMiddleware(req: NextRequest, res: NextResponse) {
  const { themes, 'default': defaultTheme } = appConfig.shell.topBar.colorTheme;
  const colorModeCookie = req.cookies.get(cookiesLib.NAMES.COLOR_MODE);
  const colorThemeCookie = req.cookies.get(cookiesLib.NAMES.COLOR_THEME);

  const nextTheme = (() => {
    if (colorThemeCookie && !isColorThemeAvailable(colorThemeCookie.value)) {
      // a color mode the user already has outranks the configured default,
      // otherwise narrowing the theme list flips returning users to the other mode
      if (colorModeCookie) {
        const themeId = getDefaultColorTheme(colorModeCookie.value as ColorMode);
        return themes.find((theme) => theme.id === themeId);
      }

      return defaultTheme ?? themes[0];
    }

    return colorModeCookie ? undefined : defaultTheme;
  })();

  if (!nextTheme) {
    return;
  }

  res.cookies.set(cookiesLib.NAMES.COLOR_MODE, nextTheme.colorMode, cookiesLib.getDefaultAttributes());
  res.cookies.set(cookiesLib.NAMES.COLOR_THEME, nextTheme.id, cookiesLib.getDefaultAttributes());
}
