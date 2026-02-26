import type { Feature } from './types';
import type { ApiDocsTabId } from 'types/views/apiDocs';
import { API_DOCS_TABS } from 'types/views/apiDocs';

import { getEnvValue, parseEnvJson } from '../utils';

const tabs = (() => {
  const value = (parseEnvJson<Array<ApiDocsTabId>>(getEnvValue('NEXT_PUBLIC_API_DOCS_TABS')) || API_DOCS_TABS)
    .filter((tab) => API_DOCS_TABS.includes(tab));

  return value.length > 0 ? value : undefined;
})();

const title = 'API documentation';

const config: Feature<{
  tabs: Array<ApiDocsTabId>;
}> = (() => {
  if (tabs) {
    return Object.freeze({
      title,
      isEnabled: true,
      tabs,
    });
  }

  return Object.freeze({
    title,
    isEnabled: false,
  });
})();

export default config;
