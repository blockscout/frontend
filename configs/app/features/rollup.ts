import type { Feature } from './types';
import type { RollupType } from 'types/client/rollup';
import { ROLLUP_TYPES } from 'types/client/rollup';

import stripTrailingSlash from 'lib/stripTrailingSlash';

import { getEnvValue } from '../utils';

const type = (() => {
  const envValue = getEnvValue('NEXT_PUBLIC_ROLLUP_TYPE');
  return ROLLUP_TYPES.find((type) => type === envValue);
})();

const L1BaseUrl = getEnvValue('NEXT_PUBLIC_ROLLUP_L1_BASE_URL');
const L2WithdrawalUrl = getEnvValue('NEXT_PUBLIC_ROLLUP_L2_WITHDRAWAL_URL');

const title = 'Rollup (L2) chain';

const config: Feature<{
  type: RollupType;
  L1BaseUrl: string;
  homepage: { showLatestBlocks: boolean };
  outputRootsEnabled: boolean;
  L2WithdrawalUrl: string | undefined;
  parentChainName: string | undefined;
}> = (() => {
  if (type && L1BaseUrl) {
    return Object.freeze({
      title,
      isEnabled: true,
      type,
      L1BaseUrl: stripTrailingSlash(L1BaseUrl),
      L2WithdrawalUrl: type === 'optimistic' ? L2WithdrawalUrl : undefined,
      outputRootsEnabled: type === 'optimistic' && getEnvValue('NEXT_PUBLIC_ROLLUP_OUTPUT_ROOTS_ENABLED') === 'true',
      parentChainName: type === 'arbitrum' ? getEnvValue('NEXT_PUBLIC_ROLLUP_PARENT_CHAIN_NAME') : undefined,
      homepage: {
        showLatestBlocks: getEnvValue('NEXT_PUBLIC_ROLLUP_HOMEPAGE_SHOW_LATEST_BLOCKS') === 'true',
      },
    });
  }

  return Object.freeze({
    title,
    isEnabled: false,
  });
})();

export default config;
