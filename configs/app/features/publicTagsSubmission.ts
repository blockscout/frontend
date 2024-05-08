import type { Feature } from './types';

import services from '../services';
import { getEnvValue } from '../utils';
import addressMetadata from './addressMetadata';

const apiHost = getEnvValue('NEXT_PUBLIC_ADMIN_SERVICE_API_HOST');

const title = 'Public tag submission';

const config: Feature<{ api: { endpoint: string; basePath: string } }> = (() => {
  if (services.reCaptcha.siteKey && addressMetadata.isEnabled && apiHost) {
    return Object.freeze({
      title,
      isEnabled: true,
      api: {
        endpoint: apiHost,
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
