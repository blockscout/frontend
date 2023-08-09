import { getEnvValue } from '../utils';

export default Object.freeze({
  title: 'Beacon chain',
  isEnabled: getEnvValue(process.env.NEXT_PUBLIC_HAS_BEACON_CHAIN) === 'true',
  currency: {
    symbol: getEnvValue(process.env.NEXT_PUBLIC_BEACON_CHAIN_CURRENCY_SYMBOL) || getEnvValue(process.env.NEXT_PUBLIC_NETWORK_CURRENCY_SYMBOL),
  },
});
