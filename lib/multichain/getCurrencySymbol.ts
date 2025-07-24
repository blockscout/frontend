import multichainConfig from 'configs/multichain';

export default function getCurrencySymbol() {
  const nativeCurrency = multichainConfig()?.chains[0]?.config.chain.currency;
  return nativeCurrency?.symbol;
}
