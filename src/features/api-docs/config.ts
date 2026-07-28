// SPDX-License-Identifier: LicenseRef-Blockscout

import type { ApiDocsTabId } from 'src/features/api-docs/types/config';
import { API_DOCS_TABS } from 'src/features/api-docs/types/config';

import chain from 'src/slices/chain/config';

import { getEnvValue, parseEnvJson } from 'src/config/utils/envs';
import type { Feature } from 'src/config/utils/features';

// Chains served by the Pro API send users straight to the developer portal,
// so the in-app documentation is skipped unless an operator asks for it explicitly.
const DEV_PORTAL_URL = 'https://dev.blockscout.com/?utm_source=blockscout&utm_medium=navigation';

const tabsEnvValue = getEnvValue('NEXT_PUBLIC_API_DOCS_TABS');

const tabs = (() => {
  const value = (
    parseEnvJson<Array<ApiDocsTabId>>(tabsEnvValue) || API_DOCS_TABS
  )
    .filter((tab) => API_DOCS_TABS.includes(tab));

  return value.length > 0 ? value : undefined;
})();

const title = 'API documentation';

const config: Feature<
  { mode: 'internal'; tabs: Array<ApiDocsTabId> } |
  { mode: 'external'; url: string }
> = (() => {
  if (chain.isProApiSupported && !tabsEnvValue) {
    return Object.freeze({
      title,
      isEnabled: true,
      mode: 'external' as const,
      url: DEV_PORTAL_URL,
    });
  }

  if (tabs) {
    return Object.freeze({
      title,
      isEnabled: true,
      mode: 'internal' as const,
      tabs,
    });
  }

  return Object.freeze({
    title,
    isEnabled: false,
  });
})();

export default config;
