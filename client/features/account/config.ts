// SPDX-License-Identifier: LicenseRef-Blockscout

import apis from 'client/config/apis';
import app from 'client/config/app';
import services from 'client/config/services';
import { getEnvValue } from 'client/config/utils/envs';
import type { Feature } from 'client/config/utils/features';

import type { AuthProvider } from 'client/features/account/types/client';

import verifiedTokens from 'client/features/verified-tokens/config';

const title = 'My account';

const apiKeysButton = (() => {
  const value = getEnvValue('NEXT_PUBLIC_ACCOUNT_API_KEYS_BUTTON');
  if (value === undefined || value === 'true') {
    return true;
  }
  if (value === 'false') {
    return false;
  }
  return value;
})();

const config: Feature<{
  isEnabled: true;
  authProvider: AuthProvider;
  dynamic?: {
    environmentId: string;
  };
  apiKeys: {
    alertMessage: string | undefined;
    button: boolean | string;
  };
  addressVerificationEnabled: boolean;
}> = (() => {

  if (
    !app.isPrivateMode &&
    getEnvValue('NEXT_PUBLIC_IS_ACCOUNT_SUPPORTED') === 'true'
  ) {
    const authProvider = getEnvValue('NEXT_PUBLIC_ACCOUNT_AUTH_PROVIDER');
    const dynamicEnvironmentId = getEnvValue('NEXT_PUBLIC_ACCOUNT_DYNAMIC_ENVIRONMENT_ID');
    const addressVerificationEnabled = !app.isPrivateMode && verifiedTokens.isEnabled && apis.admin !== undefined;

    if (authProvider === 'dynamic' && dynamicEnvironmentId) {
      return Object.freeze({
        title,
        isEnabled: true,
        authProvider: 'dynamic',
        dynamic: {
          environmentId: dynamicEnvironmentId,
        },
        apiKeys: {
          alertMessage: getEnvValue('NEXT_PUBLIC_API_KEYS_ALERT_MESSAGE'),
          button: apiKeysButton,
        },
        addressVerificationEnabled,
      });
    }

    if (services.reCaptchaV2.siteKey) {
      return Object.freeze({
        title,
        isEnabled: true,
        authProvider: 'auth0',
        apiKeys: {
          alertMessage: getEnvValue('NEXT_PUBLIC_API_KEYS_ALERT_MESSAGE'),
          button: apiKeysButton,
        },
        addressVerificationEnabled,
      });
    }
  }

  return Object.freeze({
    title,
    isEnabled: false,
  });
})();

export default config;
