import type { ChainConfig } from 'types/multichain';

import type { ColorMode } from 'toolkit/chakra/color-mode';

export default function getIconUrl(config: ChainConfig, colorMode?: ColorMode) {
  if (!config.config?.UI?.navigation?.icon || !config.config.app) {
    return;
  }

  const appUrl = config.config.app.baseUrl;
  const iconPath = colorMode === 'dark' ?
    (config.config.UI.navigation.icon.dark || config.config.UI.navigation.icon.default) :
    config.config.UI.navigation.icon.default;

  return `${ appUrl }${ iconPath }`;
}
