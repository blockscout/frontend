// SPDX-License-Identifier: LicenseRef-Blockscout

import type { NextRequest, NextResponse } from 'next/server';

import appConfig from 'src/config';
import * as cookiesLib from 'src/shared/storage/cookies';

export default function colorThemeMiddleware(req: NextRequest, res: NextResponse) {
  const colorModeCookie = req.cookies.get(cookiesLib.NAMES.COLOR_MODE);

  if (!colorModeCookie) {
    if (appConfig.shell.topBar.colorTheme.default) {
      res.cookies.set(cookiesLib.NAMES.COLOR_MODE, appConfig.shell.topBar.colorTheme.default.colorMode, cookiesLib.getDefaultAttributes());
      res.cookies.set(cookiesLib.NAMES.COLOR_THEME, appConfig.shell.topBar.colorTheme.default.id, cookiesLib.getDefaultAttributes());
    }
  }
}
