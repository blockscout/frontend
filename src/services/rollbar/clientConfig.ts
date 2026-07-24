// SPDX-License-Identifier: LicenseRef-Blockscout

import type { Configuration } from 'rollbar';

import config from 'src/config';
import { ABSENT_PARAM_ERROR_MESSAGE } from 'src/shared/errors/throw-on-absent-param-error';
import { RESOURCE_LOAD_ERROR_MESSAGE } from 'src/shared/errors/throw-on-resource-load-error';

import { isBot, isHeadlessBrowser, isNextJsChunkError, getRequestInfo, getExceptionClass, getExceptionOriginFileName } from './utils';

/**
 * Rollbar client options — imported only once the SDK chunk is loaded so the ignore helpers and
 * message constants stay out of the critical path until then (they ride along with `rollbar`).
 */
export function buildClientConfig(accessToken: string): Configuration {
  return {
    accessToken,
    environment: config.services.rollbar.environment,
    payload: {
      code_version: config.services.rollbar.codeVersion,
      app_instance: config.services.rollbar.instance,
    },
    checkIgnore(_isUncaught, _args, item) {
      if (isBot(window.navigator.userAgent)) {
        return true;
      }

      if (isHeadlessBrowser(window.navigator.userAgent)) {
        return true;
      }

      if (isNextJsChunkError(getRequestInfo(item)?.url)) {
        return true;
      }

      const exceptionClass = getExceptionClass(item);
      const IGNORED_EXCEPTION_CLASSES = [
        // these are React errors - "NotFoundError: Failed to execute 'removeChild' on 'Node': The node to be removed is not a child of this node."
        // they could be caused by browser extensions
        // one of the examples - https://github.com/facebook/react/issues/11538
        // we can ignore them for now
        'NotFoundError',

        'AbortError',
      ];

      if (exceptionClass && IGNORED_EXCEPTION_CLASSES.includes(exceptionClass)) {
        return true;
      }

      const originFileName = getExceptionOriginFileName(item);
      const IGNORED_ORIGIN_FILE_NAMES_CHUNKS = [
        '/node_modules/@walletconnect',
        '/node_modules/@reown',
        'chrome-extension://',
      ];

      if (originFileName && IGNORED_ORIGIN_FILE_NAMES_CHUNKS.some((chunk) => originFileName.includes(chunk))) {
        return true;
      }

      return false;
    },
    hostSafeList: [ config.app.host ].filter(Boolean),
    ignoredMessages: [
      // these are errors that we throw on when make a call to the API
      RESOURCE_LOAD_ERROR_MESSAGE,
      ABSENT_PARAM_ERROR_MESSAGE,

      // Filter out network-related errors that are usually not actionable
      'Network Error',
      'Failed to fetch',

      // Filter out CORS errors from third-party extensions
      'cross-origin',

      // Filter out client-side navigation cancellations
      'cancelled navigation',
    ],
    maxItems: 10, // Max items per page load
    // uncaught / unhandledrejection coverage is owned by the early window listeners in queue.ts —
    // enabling Rollbar's built-in capture here would double-report
    captureUncaught: false,
    captureUnhandledRejections: false,
  };
}
