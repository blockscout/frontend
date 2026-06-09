// SPDX-License-Identifier: LicenseRef-Blockscout

import type { AuthProvider } from 'src/features/account/types/client';

import apis from 'src/api/config';

import verifiedTokens from 'src/features/verified-tokens/config';

import app from 'src/config/app';
import * as services from 'src/config/services';
import { getEnvValue } from 'src/config/utils/envs';
import type { Feature } from 'src/config/utils/features';

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

    if (services.reCaptcha.siteKey) {
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
