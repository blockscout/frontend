// SPDX-License-Identifier: LicenseRef-Blockscout

import type { NextRequest, NextResponse } from 'next/server';

import * as cookiesLib from 'client/shared/storage/cookies';

import config from 'configs/app';

export default function poorReputationTokensMiddleware(req: NextRequest, res: NextResponse) {
  if (config.features.multichain.isEnabled) {
    const showPoorReputationTokensCookie = req.cookies.get(cookiesLib.NAMES.SHOW_POOR_REPUTATION_TOKENS);

    if (!showPoorReputationTokensCookie) {
      res.cookies.set(cookiesLib.NAMES.SHOW_POOR_REPUTATION_TOKENS, 'false', cookiesLib.getDefaultAttributes());
    }
  }
}
