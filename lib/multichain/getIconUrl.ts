import type { ChainConfig } from 'types/multichain';

export default function getIconUrl(config: ChainConfig) {
  const appUrl = config.config.app.baseUrl;
  const iconPath = config.config.UI.navigation.icon.default;

  return `${ appUrl }${ iconPath }`;
}
