import type { Feature } from './types';

import services from '../services';
import { getEnvValue } from '../utils';

const title = 'My account';

const authUrl = getEnvValue('NEXT_PUBLIC_ACCOUNT_AUTH_URL');

const config: Feature<{ isEnabled: true; recaptchaSiteKey: string; authUrl?: string }> = (() => {
  if (getEnvValue('NEXT_PUBLIC_IS_ACCOUNT_SUPPORTED') === 'true' && (services.reCaptchaV2.siteKey || authUrl)) {
    return Object.freeze({
      title,
      isEnabled: true,
      recaptchaSiteKey: services.reCaptchaV2.siteKey || '',
      authUrl,
    });
  }

  return Object.freeze({
    title,
    isEnabled: false,
  });
})();

export default config;
