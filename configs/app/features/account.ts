import type { Feature } from './types';
import type { AuthProvider } from 'types/client/account';

import app from '../app';
import services from '../services';
import { getEnvValue } from '../utils';

const title = 'My account';

const config: Feature<{
  isEnabled: true;
  recaptchaSiteKey: string;
  authProvider: AuthProvider;
  dynamic?: {
    environmentId: string;
  };
}> = (() => {

  if (
    !app.isPrivateMode &&
    getEnvValue('NEXT_PUBLIC_IS_ACCOUNT_SUPPORTED') === 'true' &&
    services.reCaptchaV2.siteKey
  ) {
    const authProvider = getEnvValue('NEXT_PUBLIC_ACCOUNT_AUTH_PROVIDER');
    const dynamicEnvironmentId = getEnvValue('NEXT_PUBLIC_ACCOUNT_DYNAMIC_ENVIRONMENT_ID');

    return Object.freeze({
      title,
      isEnabled: true,
      recaptchaSiteKey: services.reCaptchaV2.siteKey,
      authProvider: authProvider === 'dynamic' && dynamicEnvironmentId ? 'dynamic' : 'auth0',
      dynamic: authProvider === 'dynamic' && dynamicEnvironmentId ? {
        environmentId: dynamicEnvironmentId,
      } : undefined,
    });
  }

  return Object.freeze({
    title,
    isEnabled: false,
  });
})();

export default config;
