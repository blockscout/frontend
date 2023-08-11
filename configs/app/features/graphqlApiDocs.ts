import type { Feature } from './types';

import { getEnvValue } from '../utils';

const defaultTxHash = getEnvValue(process.env.NEXT_PUBLIC_GRAPHIQL_TRANSACTION);

const title = 'GraphQL API documentation';

const config: Feature<{ defaultTxHash: string | undefined }> = (() => {
  return Object.freeze({
    title,
    isEnabled: true,
    defaultTxHash,
  });
})();

export default config;
