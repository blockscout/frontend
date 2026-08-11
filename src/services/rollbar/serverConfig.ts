// SPDX-License-Identifier: LicenseRef-Blockscout

import type { Configuration } from 'rollbar';

import config from 'src/config';

import { isIgnoredExceptionClass } from './utils';

/**
 * Rollbar options for the error-page instance in `src/pages/_error.tsx`. It reports the explicit error
 * handed to `getInitialProps`, plus server-side uncaught exceptions — `captureUncaught` is on because
 * those page-crash errors surface nowhere else, and the server has none of the third-party `window`
 * noise the browser instance has to filter. `captureUnhandledRejections` stays off, and the shared
 * `isIgnoredExceptionClass` check drops the same DOM / Abort classes the browser instance drops.
 */
export function buildServerConfig(accessToken: string): Configuration {
  return {
    accessToken,
    environment: config.services.rollbar.environment,
    payload: {
      code_version: config.services.rollbar.codeVersion,
      app_instance: config.services.rollbar.instance,
    },
    checkIgnore: (_isUncaught, _args, item) => isIgnoredExceptionClass(item),
    captureUncaught: true,
    captureUnhandledRejections: false,
  };
}
