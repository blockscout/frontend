// SPDX-License-Identifier: LicenseRef-Blockscout

import type { NextRequest, NextResponse } from 'next/server';

import { isColorThemeAvailable } from 'src/shell/top-bar/settings/color-theme/utils';

import appConfig from 'src/config';
import * as cookiesLib from 'src/shared/storage/cookies';

export default function colorThemeMiddleware(req: NextRequest, res: NextResponse) {
  const { themes, 'default': defaultTheme } = appConfig.shell.topBar.colorTheme;
  const colorModeCookie = req.cookies.get(cookiesLib.NAMES.COLOR_MODE);
  const colorThemeCookie = req.cookies.get(cookiesLib.NAMES.COLOR_THEME);

  const nextTheme = (() => {
    if (colorThemeCookie && !isColorThemeAvailable(colorThemeCookie.value)) {
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
