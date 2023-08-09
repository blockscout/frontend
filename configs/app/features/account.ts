import stripTrailingSlash from 'lib/stripTrailingSlash';

import app from '../app';
import { getEnvValue } from '../utils';

const authUrl = stripTrailingSlash(getEnvValue(process.env.NEXT_PUBLIC_AUTH_URL) || app.baseUrl);

const logoutUrl = (() => {
  try {
    const envUrl = getEnvValue(process.env.NEXT_PUBLIC_LOGOUT_URL);
    const auth0ClientId = getEnvValue(process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID);
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

export default Object.freeze({
  title: 'My account',
  isEnabled: getEnvValue(process.env.NEXT_PUBLIC_IS_ACCOUNT_SUPPORTED) === 'true',
  authUrl,
  logoutUrl,
});
