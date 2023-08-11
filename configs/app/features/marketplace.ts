import type { Feature } from './types';

import chain from '../chain';
import { getEnvValue } from '../utils';

const configUrl = getEnvValue(process.env.NEXT_PUBLIC_MARKETPLACE_CONFIG_URL);
const submitFormUrl = getEnvValue(process.env.NEXT_PUBLIC_MARKETPLACE_SUBMIT_FORM);

const title = 'Marketplace';

const config: Feature<{ configUrl: string; submitFormUrl: string }> = (() => {
  if (
    chain.rpcUrl &&
    configUrl &&
    submitFormUrl
  ) {
    return Object.freeze({
      title,
      isEnabled: true,
      configUrl,
      submitFormUrl,
    });
  }

  return Object.freeze({
    title,
    isEnabled: false,
  });
})();

export default config;
