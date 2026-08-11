// SPDX-License-Identifier: LicenseRef-Blockscout

import type { Configuration } from 'rollbar';

import config from 'src/config';

import { isIgnoredExceptionClass } from './utils';

/**
 * Rollbar options for the error-page instance in `src/pages/_error.tsx`. It reports the explicit error
 * handed to `getInitialProps`, plus server-side uncaught exceptions — `captureUncaught` is on there
 * because those page-crash errors surface nowhere else, and the server has none of the third-party
 * `window` noise the browser instance has to filter. It is gated to the server: this module also loads
 * in the browser on a client-side error-page navigation, where an uncaught handler would bypass the
 * queue's own-bundle origin gate and recapture the very noise we drop. `captureUnhandledRejections`
 * stays off, and the shared `isIgnoredExceptionClass` check drops the same DOM / Abort classes the
 * browser instance drops.
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
    captureUncaught: typeof window === 'undefined',
    captureUnhandledRejections: false,
  };
}
