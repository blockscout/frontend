import type { NetworkExplorer } from 'types/networks';

import { getEnvValue, parseEnvJson } from './utils';

const DEFAULT_CURRENCY_DECIMALS = 18;

const chain = Object.freeze({
  id: getEnvValue(process.env.NEXT_PUBLIC_NETWORK_ID),
  name: getEnvValue(process.env.NEXT_PUBLIC_NETWORK_NAME),
  shortName: getEnvValue(process.env.NEXT_PUBLIC_NETWORK_SHORT_NAME),
  logo: {
    'default': getEnvValue(process.env.NEXT_PUBLIC_NETWORK_LOGO),
    dark: getEnvValue(process.env.NEXT_PUBLIC_NETWORK_LOGO_DARK),
  },
  icon: {
    'default': getEnvValue(process.env.NEXT_PUBLIC_NETWORK_ICON),
    dark: getEnvValue(process.env.NEXT_PUBLIC_NETWORK_ICON_DARK),
  },
  currency: {
    name: getEnvValue(process.env.NEXT_PUBLIC_NETWORK_CURRENCY_NAME),
    symbol: getEnvValue(process.env.NEXT_PUBLIC_NETWORK_CURRENCY_SYMBOL),
    decimals: Number(getEnvValue(process.env.NEXT_PUBLIC_NETWORK_CURRENCY_DECIMALS)) || DEFAULT_CURRENCY_DECIMALS,
    address: getEnvValue(process.env.NEXT_PUBLIC_NETWORK_TOKEN_ADDRESS),
  },
  rpcUrl: getEnvValue(process.env.NEXT_PUBLIC_NETWORK_RPC_URL),
  isTestnet: getEnvValue(process.env.NEXT_PUBLIC_IS_TESTNET) === 'true',
  explorers: parseEnvJson<Array<NetworkExplorer>>(getEnvValue(process.env.NEXT_PUBLIC_NETWORK_EXPLORERS)) || [],
  verificationType: getEnvValue(process.env.NEXT_PUBLIC_NETWORK_VERIFICATION_TYPE) || 'mining',
});

export default chain;
