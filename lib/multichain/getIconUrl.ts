import type { ChainConfig } from 'types/multichain';

export default function getIconUrl(config: ChainConfig) {
  if (!config.config?.UI?.navigation?.icon || !config.config.app) {
    return;
  }

  const iconPath = config.config.UI.navigation.icon.default;

  if (iconPath?.startsWith('http')) {
    return iconPath;
  }

  const appUrl = config.config.app.baseUrl;
  return `${ appUrl }${ iconPath }`;
}
