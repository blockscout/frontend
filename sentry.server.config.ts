import * as Sentry from '@sentry/nextjs';

import { config, configureScope } from 'lib/sentry/config';

if (config) {
  Sentry.init(config);
  Sentry.configureScope(configureScope);
}
