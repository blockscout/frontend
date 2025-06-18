import type { Feature } from './types';

import { getEnvValue, getExternalAssetFilePath, parseEnvJson } from '../utils';

// config file will be downloaded at run-time and saved in the public folder
const widgets = parseEnvJson<Array<string>>(getEnvValue('NEXT_PUBLIC_ADDRESS_WIDGETS'));
const configUrl = getExternalAssetFilePath('NEXT_PUBLIC_ADDRESS_WIDGETS_CONFIG_URL');

const title = 'Address widgets';

const config: Feature<{ widgets: Array<string>; configUrl: string }> = (() => {
  if (widgets && widgets.length > 0 && configUrl) {
    return Object.freeze({
      title,
      isEnabled: true,
      widgets,
      configUrl,
    });
  }

  return Object.freeze({
    title,
    isEnabled: false,
  });
})();

export default config;
