import type { Feature } from './types';
import type { ApiDocsTabId } from 'types/views/apiDocs';
import { API_DOCS_TABS } from 'types/views/apiDocs';

import { getEnvValue, parseEnvJson } from '../utils';

const graphqlDefaultTxnHash = getEnvValue('NEXT_PUBLIC_GRAPHIQL_TRANSACTION');

const tabs = (() => {
  const value = (parseEnvJson<Array<ApiDocsTabId>>(getEnvValue('NEXT_PUBLIC_API_DOCS_TABS')) || API_DOCS_TABS)
    .filter((tab) => API_DOCS_TABS.includes(tab))
    .filter((tab) => !graphqlDefaultTxnHash && tab === 'graphql_api' ? false : true);

  return value.length > 0 ? value : undefined;
})();

const title = 'API documentation';

const config: Feature<{
  tabs: Array<ApiDocsTabId>;
  coreApiSwaggerUrl: string;
  graphqlDefaultTxnHash?: string;
}> = (() => {
  if (tabs) {
    return Object.freeze({
      title,
      isEnabled: true,
      tabs,
      coreApiSwaggerUrl: getEnvValue('NEXT_PUBLIC_API_SPEC_URL') || `https://raw.githubusercontent.com/blockscout/blockscout-api-v2-swagger/main/swagger.yaml`,
      graphqlDefaultTxnHash,
    });
  }

  return Object.freeze({
    title,
    isEnabled: false,
  });
})();

export default config;
