// SPDX-License-Identifier: LicenseRef-Blockscout

import type { PagePrimerConfig } from './types';

import { addressPage } from './pages/address';
import { blockPage } from './pages/block';
import { homePage } from './pages/home';
import { statsPage } from './pages/stats';
import { tokenPage } from './pages/token';
import { tokenInstancePage } from './pages/tokenInstance';
import { tokensPage } from './pages/tokens';
import { txPage } from './pages/tx';
import { userOpPage } from './pages/userOp';

export const PRIMED_PAGES: Record<string, PagePrimerConfig> = {
  '/': homePage,
  '/address/[hash]': addressPage,
  '/block/[height_or_hash]': blockPage,
  '/op/[hash]': userOpPage,
  '/stats': statsPage,
  '/token/[hash]': tokenPage,
  '/token/[hash]/instance/[id]': tokenInstancePage,
  '/tokens': tokensPage,
  '/tx/[hash]': txPage,
};
