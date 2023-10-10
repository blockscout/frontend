import type { Feature } from './types';

import stripTrailingSlash from 'lib/stripTrailingSlash';

import { getEnvValue } from '../utils';

const indexerUrl = stripTrailingSlash(getEnvValue('NEXT_PUBLIC_FORUM_INDEXER_URL') || '') || null;
const walletConnectProjectId = getEnvValue('NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID') || '';

const title = 'Forum';

const config: Feature<{ indexerUrl: string; walletConnectProjectId: string }> = (() => {
  if (
    getEnvValue('NEXT_PUBLIC_IS_FORUM_SUPPORTED') === 'true' &&
    indexerUrl &&
    walletConnectProjectId
  ) {
    return Object.freeze({
      title,
      isEnabled: true,
      walletConnectProjectId,
      indexerUrl,
    });
  }

  return Object.freeze({
    title,
    isEnabled: false,
  });
})();

export default config;
