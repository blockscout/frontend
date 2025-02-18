import type { Feature } from './types';
import type { ParentChain, RollupType } from 'types/client/rollup';
import { ROLLUP_TYPES } from 'types/client/rollup';

import stripTrailingSlash from 'lib/stripTrailingSlash';

import { getEnvValue, parseEnvJson } from '../utils';

const type = (() => {
  const envValue = getEnvValue('NEXT_PUBLIC_ROLLUP_TYPE');
  return ROLLUP_TYPES.find((type) => type === envValue);
})();

const L2WithdrawalUrl = getEnvValue('NEXT_PUBLIC_ROLLUP_L2_WITHDRAWAL_URL');

const parentChain: ParentChain | undefined = (() => {
  const envValue = parseEnvJson<ParentChain>(getEnvValue('NEXT_PUBLIC_ROLLUP_PARENT_CHAIN'));
  const baseUrl = stripTrailingSlash(getEnvValue('NEXT_PUBLIC_ROLLUP_L1_BASE_URL') || '');
  const chainName = getEnvValue('NEXT_PUBLIC_ROLLUP_PARENT_CHAIN_NAME');

  if (!baseUrl && !envValue?.baseUrl) {
    return;
  }

  return {
    ...envValue,
    name: chainName ?? envValue?.name,
    baseUrl: baseUrl ?? envValue?.baseUrl,
  };
})();

const title = 'Rollup (L2) chain';

const config: Feature<{
  type: RollupType;
  homepage: { showLatestBlocks: boolean };
  outputRootsEnabled: boolean;
  L2WithdrawalUrl: string | undefined;
  parentChain: ParentChain;
  DA: {
    celestia: {
      namespace: string | undefined;
    };
  };
}> = (() => {
  if (type && parentChain) {
    return Object.freeze({
      title,
      isEnabled: true,
      type,
      L2WithdrawalUrl: type === 'optimistic' ? L2WithdrawalUrl : undefined,
      outputRootsEnabled: type === 'optimistic' && getEnvValue('NEXT_PUBLIC_ROLLUP_OUTPUT_ROOTS_ENABLED') === 'true',
      homepage: {
        showLatestBlocks: getEnvValue('NEXT_PUBLIC_ROLLUP_HOMEPAGE_SHOW_LATEST_BLOCKS') === 'true',
      },
      parentChain,
      DA: {
        celestia: {
          namespace: type === 'arbitrum' ? getEnvValue('NEXT_PUBLIC_ROLLUP_DA_CELESTIA_NAMESPACE') : undefined,
        },
      },
    });
  }

  return Object.freeze({
    title,
    isEnabled: false,
  });
})();

export default config;
