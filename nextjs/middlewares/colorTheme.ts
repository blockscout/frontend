import type { NextRequest, NextResponse } from 'next/server';

import appConfig from 'configs/app';
import * as cookiesLib from 'lib/cookies';
import { getThemeHexWithOverrides } from 'lib/settings/colorTheme';

export default function colorThemeMiddleware(req: NextRequest, res: NextResponse) {
  const colorModeCookie = req.cookies.get(cookiesLib.NAMES.COLOR_MODE);

  if (!colorModeCookie) {
    if (appConfig.UI.colorTheme.default) {
      const hexValue = getThemeHexWithOverrides(appConfig.UI.colorTheme.default.id);

      if (!hexValue) {
        return;
      }

      res.cookies.set(cookiesLib.NAMES.COLOR_MODE, appConfig.UI.colorTheme.default.colorMode, { path: '/' });
      res.cookies.set(cookiesLib.NAMES.COLOR_MODE_HEX, hexValue, { path: '/' });
    }
  }
}
