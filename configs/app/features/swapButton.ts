import type { Feature } from './types';

import { getEnvValue } from '../utils';
import marketplace from './marketplace';

const value = getEnvValue('NEXT_PUBLIC_SWAP_BUTTON_URL');

const title = 'Swap button';

function isValidUrl(string: string) {
  try {
    new URL(string);
    return true;
  } catch (error) {
    return false;
  }
}

const config: Feature<{ dappId: string } | { url: string }> = (() => {
  if (value) {
    if (isValidUrl(value)) {
      return Object.freeze({
        title,
        isEnabled: true,
        url: value,
      });
    } else if (marketplace.isEnabled) {
      return Object.freeze({
        title,
        isEnabled: true,
        dappId: value,
      });
    }
  }

  return Object.freeze({
    title,
    isEnabled: false,
  });
})();

export default config;
