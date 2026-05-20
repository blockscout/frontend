// SPDX-License-Identifier: LicenseRef-Blockscout

import type { Feature } from './types';
import type { ArrayElement } from 'types/utils';

import { getEnvValue } from '../utils';

export const VALIDATORS_CHAIN_TYPE = [
  'stability',
  'blackfort',
  'zilliqa',
] as const;

export type ValidatorsChainType = ArrayElement<typeof VALIDATORS_CHAIN_TYPE>;

const chainType = ((): ValidatorsChainType | undefined => {
  const envValue = getEnvValue('NEXT_PUBLIC_VALIDATORS_CHAIN_TYPE') as ValidatorsChainType | undefined;
  return envValue && VALIDATORS_CHAIN_TYPE.includes(envValue) ? envValue : undefined;
})();

const title = 'Validators list';

const config: Feature<{ chainType: ValidatorsChainType }> = (() => {
  if (chainType) {
    return Object.freeze({
      title,
      isEnabled: true,
      chainType,
    });
  }

  return Object.freeze({
    title,
    isEnabled: false,
  });
})();

export default config;
