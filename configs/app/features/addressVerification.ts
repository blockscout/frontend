import type { Feature } from './types';

import { getEnvValue } from '../utils';
import account from './account';
import verifiedTokens from './verifiedTokens';

const adminServiceApiHost = getEnvValue('NEXT_PUBLIC_ADMIN_SERVICE_API_HOST');

const title = 'Address verification in "My account"';

const config: Feature<{ api: { endpoint: string; basePath: string } }> = (() => {
  if (account.isEnabled && verifiedTokens.isEnabled && adminServiceApiHost) {
    return Object.freeze({
      title: 'Address verification in "My account"',
      isEnabled: true,
      api: {
        endpoint: adminServiceApiHost,
        basePath: '',
      },
    });
  }

  return Object.freeze({
    title,
    isEnabled: false,
  });
})();

export default config;
