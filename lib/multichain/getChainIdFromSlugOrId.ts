import multichainConfig from 'configs/multichain';

export default function getChainIdFromSlugOrId(slugOrId: string) {
  const config = multichainConfig();
  if (!config) {
    return undefined;
  }

  return config.chains.find((chain) => chain.slug === slugOrId || chain.id === slugOrId)?.id;
}
