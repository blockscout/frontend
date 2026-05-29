// SPDX-License-Identifier: LicenseRef-Blockscout

import type { RollupType } from 'client/features/rollup/common/types/config';
import type { NetworkVerificationType, NetworkVerificationTypeEnvs } from 'client/slices/chain/verification-type/types/config';

import { getEnvValue, getExternalAssetFilePath, parseEnvJson } from 'client/config/utils/envs';

import { urlValidator } from 'toolkit/components/forms/validators/url';

const DEFAULT_CURRENCY_DECIMALS = 18;

const rollupType = getEnvValue('NEXT_PUBLIC_ROLLUP_TYPE') as RollupType;

const verificationType: NetworkVerificationType = (() => {
  if (rollupType === 'arbitrum') {
    return 'posting';
  }
  return getEnvValue('NEXT_PUBLIC_NETWORK_VERIFICATION_TYPE') as NetworkVerificationTypeEnvs || 'mining';
})();

const rpcUrls = (() => {
  const envValue = getEnvValue('NEXT_PUBLIC_NETWORK_RPC_URL');
  const isUrl = urlValidator(envValue);

  if (envValue && isUrl === true) {
    return [ envValue ];
  }

  const parsedValue = parseEnvJson<Array<string>>(envValue);

  return Array.isArray(parsedValue) ? parsedValue : [];
})();

const chain = Object.freeze({
  id: getEnvValue('NEXT_PUBLIC_NETWORK_ID'),
  name: getEnvValue('NEXT_PUBLIC_NETWORK_NAME'),
  shortName: getEnvValue('NEXT_PUBLIC_NETWORK_SHORT_NAME'),
  currency: {
    name: getEnvValue('NEXT_PUBLIC_NETWORK_CURRENCY_NAME'),
    weiName: getEnvValue('NEXT_PUBLIC_NETWORK_CURRENCY_WEI_NAME'),
    gweiName: getEnvValue('NEXT_PUBLIC_NETWORK_CURRENCY_GWEI_NAME'),
    symbol: getEnvValue('NEXT_PUBLIC_NETWORK_CURRENCY_SYMBOL'),
    decimals: Number(getEnvValue('NEXT_PUBLIC_NETWORK_CURRENCY_DECIMALS')) || DEFAULT_CURRENCY_DECIMALS,
    isPriceHidden: getEnvValue('NEXT_PUBLIC_HIDE_NATIVE_COIN_PRICE') === 'true' ? true : false,
  },
  secondaryCoin: {
    symbol: getEnvValue('NEXT_PUBLIC_NETWORK_SECONDARY_COIN_SYMBOL'),
  },
  logo: {
    'default': getExternalAssetFilePath('NEXT_PUBLIC_NETWORK_LOGO'),
    dark: getExternalAssetFilePath('NEXT_PUBLIC_NETWORK_LOGO_DARK'),
  },
  icon: {
    'default': getExternalAssetFilePath('NEXT_PUBLIC_NETWORK_ICON'),
    dark: getExternalAssetFilePath('NEXT_PUBLIC_NETWORK_ICON_DARK'),
  },
  rpcUrls,
  isTestnet: getEnvValue('NEXT_PUBLIC_IS_TESTNET') === 'true',
  verificationType,
  indexingStatus: {
    blocks: {
      isHidden: getEnvValue('NEXT_PUBLIC_HIDE_INDEXING_ALERT_BLOCKS') === 'true' ? true : false,
    },
    intTxs: {
      isHidden: getEnvValue('NEXT_PUBLIC_HIDE_INDEXING_ALERT_INT_TXS') === 'true' ? true : false,
    },
  },
  hasMultipleGasCurrencies: getEnvValue('NEXT_PUBLIC_NETWORK_MULTIPLE_GAS_CURRENCIES') === 'true',
});

export default chain;
