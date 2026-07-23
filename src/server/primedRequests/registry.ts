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

/**
 * First-render API requests to prime per page, keyed by the Next.js page id
 * (`__NEXT_DATA__.page`). To roll the primer out to another page, add a file in ./pages with
 * the requests its widgets make on first render (GET only) and register it here — everything
 * else (URL building, headers, CSP allowance, consumption in the fetch layer) is generic.
 */
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
