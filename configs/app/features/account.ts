import type { Feature } from './types';

import stripTrailingSlash from 'lib/stripTrailingSlash';

import app from '../app';
import { getEnvValue } from '../utils';

const authUrl = stripTrailingSlash(getEnvValue('NEXT_PUBLIC_AUTH_URL') || app.baseUrl);

const logoutUrl = (() => {
  try {
    const envUrl = getEnvValue('NEXT_PUBLIC_LOGOUT_URL');
    const auth0ClientId = getEnvValue('NEXT_PUBLIC_AUTH0_CLIENT_ID');
    const returnUrl = authUrl + '/auth/logout';

    if (!envUrl || !auth0ClientId) {
      throw Error();
    }

    const url = new URL(envUrl);
    url.searchParams.set('client_id', auth0ClientId);
    url.searchParams.set('returnTo', returnUrl);

    return url.toString();
  } catch (error) {
    return;
  }
})();

const title = 'My account';

const config: Feature<{ authUrl: string; logoutUrl: string }> = (() => {
  if (
    getEnvValue('NEXT_PUBLIC_IS_ACCOUNT_SUPPORTED') === 'true' &&
    authUrl &&
    logoutUrl
  ) {
    return Object.freeze({
      title,
      isEnabled: true,
      authUrl,
      logoutUrl,
    });
  }

  return Object.freeze({
    title,
    isEnabled: false,
  });
})();

export default config;
