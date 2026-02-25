import type { Feature } from './types';
import type { AuthProvider } from 'types/client/account';

import app from '../app';
import services from '../services';
import { getEnvValue } from '../utils';

const title = 'My account';

const config: Feature<{
  isEnabled: true;
  authProvider: AuthProvider;
  dynamic?: {
    environmentId: string;
  };
}> = (() => {

  if (
    !app.isPrivateMode &&
    getEnvValue('NEXT_PUBLIC_IS_ACCOUNT_SUPPORTED') === 'true'
  ) {
    const authProvider = getEnvValue('NEXT_PUBLIC_ACCOUNT_AUTH_PROVIDER');
    const dynamicEnvironmentId = getEnvValue('NEXT_PUBLIC_ACCOUNT_DYNAMIC_ENVIRONMENT_ID');

    if (authProvider === 'dynamic' && dynamicEnvironmentId) {
      return Object.freeze({
        title,
        isEnabled: true,
        authProvider: 'dynamic',
        dynamic: {
          environmentId: dynamicEnvironmentId,
        },
      });
    }

    if (services.reCaptchaV2.siteKey) {
      return Object.freeze({
        title,
        isEnabled: true,
        authProvider: 'auth0',
      });
    }
  }

  return Object.freeze({
    title,
    isEnabled: false,
  });
})();

export default config;
