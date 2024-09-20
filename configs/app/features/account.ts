import type { Feature } from './types';

import { getEnvValue } from '../utils';

const title = 'My account';

const config: Feature<{ isEnabled: true }> = (() => {
  return Object.freeze({
    title,
    isEnabled: getEnvValue('NEXT_PUBLIC_IS_ACCOUNT_SUPPORTED') === 'true',
  });
})();

export default config;
