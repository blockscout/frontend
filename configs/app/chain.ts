import {
  DEVNET_NETWORK_NATIVE_CURRENCY,
  FLUENT_DEVNET_CHAIN_ID,
  DEVNET_RPC_URL,
} from '@fluent.xyz/sdk-core/dist/config/devnet-config';
import {
  TESTNET_NETWORK_NATIVE_CURRENCY,
  FLUENT_TESTNET_CHAIN_ID,
  TESTNET_RPC_URL,
} from '@fluent.xyz/sdk-core/dist/config/testnet-config';

import type { RollupType } from 'types/client/rollup';
import type { NetworkVerificationType, NetworkVerificationTypeEnvs } from 'types/networks';

import { urlValidator } from 'toolkit/components/forms/validators/url';

import { getEnvValue, parseEnvJson } from './utils';

const rollupType = getEnvValue('NEXT_PUBLIC_ROLLUP_TYPE') as RollupType;

const verificationType: NetworkVerificationType = (() => {
  if (rollupType === 'arbitrum') {
    return 'posting';
  }
  if (rollupType === 'zkEvm') {
    return 'sequencing';
  }
  return getEnvValue('NEXT_PUBLIC_NETWORK_VERIFICATION_TYPE') as NetworkVerificationTypeEnvs || 'mining';
})();

const rpcUrls = (() => {
  const env = getEnvValue('NEXT_PUBLIC_CHAIN');
  const value = env === 'devnet' ? DEVNET_RPC_URL : TESTNET_RPC_URL;
  const isUrl = urlValidator(value);

  if (value && isUrl === true) {
    return [ value ];
  }

  const parsedValue = parseEnvJson<Array<string>>(value);

  return Array.isArray(parsedValue) ? parsedValue : [];
})();

const getChain = () => {
  const env = getEnvValue('NEXT_PUBLIC_CHAIN');

  switch (env) {
    case 'devnet':
      return {
        id: String(parseInt(String(FLUENT_DEVNET_CHAIN_ID), 16)),
        name: 'Fluent',
        shortName: 'Fluent',
        currency: {
          name: DEVNET_NETWORK_NATIVE_CURRENCY.name,
          weiName: getEnvValue('NEXT_PUBLIC_NETWORK_CURRENCY_WEI_NAME'),
          symbol: DEVNET_NETWORK_NATIVE_CURRENCY.symbol,
          decimals: DEVNET_NETWORK_NATIVE_CURRENCY.decimals,
        },
        secondaryCoin: {
          symbol: getEnvValue('NEXT_PUBLIC_NETWORK_SECONDARY_COIN_SYMBOL'),
        },
        hasMultipleGasCurrencies: false,
        tokenStandard: 'ERC',
        rpcUrls,
        isTestnet: true,
        verificationType,
      };
    case 'testnet':
      return {
        id: String(parseInt(String(FLUENT_TESTNET_CHAIN_ID), 16)),
        name: 'Fluent',
        shortName: 'Fluent',
        currency: {
          name: TESTNET_NETWORK_NATIVE_CURRENCY.name,
          weiName: getEnvValue('NEXT_PUBLIC_NETWORK_CURRENCY_WEI_NAME'),
          symbol: TESTNET_NETWORK_NATIVE_CURRENCY.symbol,
          decimals: TESTNET_NETWORK_NATIVE_CURRENCY.decimals,
        },
        secondaryCoin: {
          symbol: getEnvValue('NEXT_PUBLIC_NETWORK_SECONDARY_COIN_SYMBOL'),
        },
        hasMultipleGasCurrencies: false,
        tokenStandard: 'ERC',
        rpcUrls,
        isTestnet: true,
        verificationType,
      };
    default:
      return {
        id: String(parseInt(String(FLUENT_DEVNET_CHAIN_ID), 16)),
        name: 'Fluent',
        shortName: 'Fluent',
        currency: {
          name: DEVNET_NETWORK_NATIVE_CURRENCY.name,
          weiName: getEnvValue('NEXT_PUBLIC_NETWORK_CURRENCY_WEI_NAME'),
          symbol: DEVNET_NETWORK_NATIVE_CURRENCY.symbol,
          decimals: DEVNET_NETWORK_NATIVE_CURRENCY.decimals,
        },
        secondaryCoin: {
          symbol: getEnvValue('NEXT_PUBLIC_NETWORK_SECONDARY_COIN_SYMBOL'),
        },
        hasMultipleGasCurrencies: false,
        tokenStandard: 'ERC',
        rpcUrls,
        isTestnet: true,
        verificationType,
      };
  }
};

const chain = Object.freeze(getChain());

export default chain;
