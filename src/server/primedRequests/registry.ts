// SPDX-License-Identifier: LicenseRef-Blockscout

import type { PagePrimerConfig } from './types';

import { homePage } from './pages/home';
import { txPage } from './pages/tx';

/**
 * First-render API requests to prime per page, keyed by the Next.js page id
 * (`__NEXT_DATA__.page`). To roll the primer out to another page, add a file in ./pages with
 * the requests its widgets make on first render (GET only) and register it here — everything
 * else (URL building, headers, CSP allowance, consumption in the fetch layer) is generic.
 */
export const PRIMED_PAGES: Record<string, PagePrimerConfig> = {
  '/': homePage,
  '/tx/[hash]': txPage,
};
