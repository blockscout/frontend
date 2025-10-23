import type { ExternalChain } from 'types/externalChains';

// TODO @tom2drum remove this file
export default function getIconUrl(config: ExternalChain) {
  return config.logo;
}
