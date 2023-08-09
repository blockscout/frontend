import { getEnvValue } from './utils';

const DEFAULT_CURRENCY_DECIMALS = 18;

const chain = Object.freeze({
  id: getEnvValue(process.env.NEXT_PUBLIC_NETWORK_ID),
  name: getEnvValue(process.env.NEXT_PUBLIC_NETWORK_NAME),
  shortName: getEnvValue(process.env.NEXT_PUBLIC_NETWORK_SHORT_NAME),
  currency: {
    name: getEnvValue(process.env.NEXT_PUBLIC_NETWORK_CURRENCY_NAME),
    symbol: getEnvValue(process.env.NEXT_PUBLIC_NETWORK_CURRENCY_SYMBOL),
    decimals: Number(getEnvValue(process.env.NEXT_PUBLIC_NETWORK_CURRENCY_DECIMALS)) || DEFAULT_CURRENCY_DECIMALS,
  },
  rpcUrl: getEnvValue(process.env.NEXT_PUBLIC_NETWORK_RPC_URL),
  isTestnet: getEnvValue(process.env.NEXT_PUBLIC_IS_TESTNET) === 'true',
  verificationType: getEnvValue(process.env.NEXT_PUBLIC_NETWORK_VERIFICATION_TYPE) || 'mining',
});

export default chain;
