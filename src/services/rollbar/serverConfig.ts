// SPDX-License-Identifier: LicenseRef-Blockscout

import type { Configuration } from 'rollbar';

import config from 'src/config';

import { isIgnoredExceptionClass } from './utils';

/**
 * Rollbar options for the error-page instance in `src/pages/_error.tsx`. That instance runs on the
 * server (and on client-side error navigations) and reports only the explicit error handed to
 * `getInitialProps`; global capture stays off so it never re-reports, unfiltered, what the browser
 * instance already drops.
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
    captureUncaught: false,
    captureUnhandledRejections: false,
  };
}
