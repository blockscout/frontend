import type { Feature } from './types';

import app from '../app';
import { getEnvValue } from '../utils';
import usercentricsFeature from './usercentrics';

const clientKey = getEnvValue('NEXT_PUBLIC_GROWTH_BOOK_CLIENT_KEY');

const title = 'GrowthBook feature flagging and A/B testing';

const config: Feature<{ clientKey: string }> = (() => {
  if (!app.isPrivateMode && !(usercentricsFeature.isEnabled && !usercentricsFeature.consent?.growthBook) && clientKey) {
    return Object.freeze({
      title,
      isEnabled: true,
      clientKey,
    });
  }

  return Object.freeze({
    title,
    isEnabled: false,
  });
})();

export default config;
