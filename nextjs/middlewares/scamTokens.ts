// SPDX-License-Identifier: LicenseRef-Blockscout

import type { NextRequest, NextResponse } from 'next/server';

import config from 'client/config';
import * as cookiesLib from 'client/shared/storage/cookies';

export default function scamTokensMiddleware(req: NextRequest, res: NextResponse) {
  if (config.slices.token.hideScamTokensEnabled) {
    const showScamTokensCookie = req.cookies.get(cookiesLib.NAMES.SHOW_SCAM_TOKENS);

    if (!showScamTokensCookie) {
      res.cookies.set(cookiesLib.NAMES.SHOW_SCAM_TOKENS, 'false', cookiesLib.getDefaultAttributes());
    }
  }
}
