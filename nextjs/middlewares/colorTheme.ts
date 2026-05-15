// SPDX-License-Identifier: LicenseRef-Blockscout

import type { NextRequest, NextResponse } from 'next/server';

import * as cookiesLib from 'client/shared/storage/cookies';

import appConfig from 'configs/app';

export default function colorThemeMiddleware(req: NextRequest, res: NextResponse) {
  const colorModeCookie = req.cookies.get(cookiesLib.NAMES.COLOR_MODE);

  if (!colorModeCookie) {
    if (appConfig.UI.colorTheme.default) {
      res.cookies.set(cookiesLib.NAMES.COLOR_MODE, appConfig.UI.colorTheme.default.colorMode, cookiesLib.getDefaultAttributes());
      res.cookies.set(cookiesLib.NAMES.COLOR_THEME, appConfig.UI.colorTheme.default.id, cookiesLib.getDefaultAttributes());
    }
  }
}
