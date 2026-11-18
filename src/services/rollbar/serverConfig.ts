// SPDX-License-Identifier: LicenseRef-Blockscout

import type { Configuration } from 'rollbar';

import config from 'src/config';

import { isIgnoredExceptionClass } from './utils';

export function buildServerConfig(accessToken: string): Configuration {
  return {
    accessToken,
    environment: config.services.rollbar.environment,
    payload: {
      code_version: config.services.rollbar.codeVersion,
      app_instance: config.services.rollbar.instance,
    },
    checkIgnore: (_isUncaught, _args, item) => isIgnoredExceptionClass(item),
    // On the server an uncaught page crash surfaces nowhere else. This config also runs in the browser on a
    // client-side error page, where a global handler would bypass the queue's own-bundle origin gate.
    captureUncaught: typeof window === 'undefined',
    captureUnhandledRejections: false,
  };
}
