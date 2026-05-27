// SPDX-License-Identifier: LicenseRef-Blockscout

import { getEnvValue, parseEnvJson } from 'client/config/utils/envs';
import type { Feature } from 'client/config/utils/features';

import type { ApiDocsTabId } from 'client/features/api-docs/types/config';
import { API_DOCS_TABS } from 'client/features/api-docs/types/config';

const tabs = (() => {
  const DEFAULT_TABS = getEnvValue('NEXT_PUBLIC_PRO_API_SUPPORTED') === 'true' ?
    API_DOCS_TABS :
    API_DOCS_TABS.filter((tab) => tab !== 'pro_api');
  const value = (
    parseEnvJson<Array<ApiDocsTabId>>(getEnvValue('NEXT_PUBLIC_API_DOCS_TABS')) || DEFAULT_TABS
  )
    .filter((tab) => API_DOCS_TABS.includes(tab));

  return value.length > 0 ? value : undefined;
})();

const title = 'API documentation';

const config: Feature<{
  tabs: Array<ApiDocsTabId>;
  alertMessage: string | undefined;
}> = (() => {
  if (tabs) {
    return Object.freeze({
      title,
      isEnabled: true,
      tabs,
      alertMessage: getEnvValue('NEXT_PUBLIC_API_DOCS_ALERT_MESSAGE'),
    });
  }

  return Object.freeze({
    title,
    isEnabled: false,
  });
})();

export default config;
