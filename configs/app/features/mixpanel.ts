import type { Feature } from './types';

import { getEnvValue } from '../utils';

const projectToken = getEnvValue('NEXT_PUBLIC_MIXPANEL_PROJECT_TOKEN');

const title = 'Mixpanel analytics';

const config: Feature<{ projectToken: string }> = (() => {
  if (projectToken) {
    return Object.freeze({
      title,
      isEnabled: true,
      projectToken,
    });
  }

  return Object.freeze({
    title,
    isEnabled: false,
  });
})();

export default config;
