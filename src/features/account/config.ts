// SPDX-License-Identifier: LicenseRef-Blockscout

import type { AuthProvider } from 'src/features/account/types/client';

import apis from 'src/api/config';

import chain from 'src/slices/chain/config';

import verifiedTokens from 'src/features/verified-tokens/config';

import app from 'src/config/app';
import * as services from 'src/config/services';
import { getEnvValue } from 'src/config/utils/envs';
import type { Feature } from 'src/config/utils/features';

const title = 'My account';

const API_KEYS_ALERT_MESSAGE_DEFAULT = '<b>Deprecation Notice:</b> Chain-specific API keys are deprecated.<br>' +
  'Please migrate to the <a href="https://dev.blockscout.com/?utm_source=blockscout_account" target="_blank">Blockscout PRO API</a> ' +
  'for multichain access.';

// Chains served by the Pro API get the deprecation notice out of the box; an explicitly
// empty value is how an instance opts out of it.
const apiKeysAlertMessage = getEnvValue('NEXT_PUBLIC_API_KEYS_ALERT_MESSAGE') ??
  (chain.isProApiSupported ? API_KEYS_ALERT_MESSAGE_DEFAULT : undefined);

const config: Feature<{
  isEnabled: true;
  authProvider: AuthProvider;
  dynamic?: {
    environmentId: string;
  };
  apiKeys: {
    alertMessage: string | undefined;
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
          alertMessage: apiKeysAlertMessage,
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
          alertMessage: apiKeysAlertMessage,
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
