import type { NextRequest, NextResponse } from 'next/server';

import UI from 'configs/app/ui';
import * as cookiesLib from 'lib/cookies';

export default function colorThemeMiddleware(req: NextRequest, res: NextResponse) {
  const colorModeCookie = req.cookies.get(cookiesLib.NAMES.COLOR_MODE);

  if (!colorModeCookie) {
    if (UI.colorTheme.default) {
      res.cookies.set(cookiesLib.NAMES.COLOR_MODE, UI.colorTheme.default.colorMode, { path: '/' });
      res.cookies.set(cookiesLib.NAMES.COLOR_THEME, UI.colorTheme.default.hex, { path: '/' });
    }
  }
}
