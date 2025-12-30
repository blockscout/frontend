import type { Feature } from './types';
import type { AuthProvider } from 'types/client/account';

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
  if (getEnvValue('NEXT_PUBLIC_IS_ACCOUNT_SUPPORTED') === 'true' && services.reCaptchaV2.siteKey) {
    const authProvider = (getEnvValue('NEXT_PUBLIC_ACCOUNT_AUTH_PROVIDER') || 'auth0') as AuthProvider;
    const dynamicEnvironmentId = getEnvValue('NEXT_PUBLIC_ACCOUNT_DYNAMIC_ENVIRONMENT_ID');

    return Object.freeze({
      title,
      isEnabled: true,
      recaptchaSiteKey: services.reCaptchaV2.siteKey,
      authProvider,
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
