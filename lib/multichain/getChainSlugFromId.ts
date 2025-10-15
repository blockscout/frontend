import multichainConfig from 'configs/multichain';

export default function getChainSlugFromId(id: string) {
  const config = multichainConfig();
  if (!config) {
    return undefined;
  }

  return config.chains.find((chain) => chain.config.chain.id === id)?.slug;
}
