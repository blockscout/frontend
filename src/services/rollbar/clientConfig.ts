// SPDX-License-Identifier: LicenseRef-Blockscout

import type { Configuration } from 'rollbar';

import config from 'src/config';
import { ABSENT_PARAM_ERROR_MESSAGE } from 'src/shared/errors/throw-on-absent-param-error';
import { RESOURCE_LOAD_ERROR_MESSAGE } from 'src/shared/errors/throw-on-resource-load-error';

import {
  isBot,
  isHeadlessBrowser,
  isNextJsChunkError,
  getRequestInfo,
  getExceptionOriginFileName,
  isIgnoredExceptionClass,
  isMonacoCdnError,
  isInjectedScriptError,
} from './utils';

/**
 * Rollbar client options — imported only once the SDK chunk is loaded so the ignore helpers and
 * message constants stay out of the critical path until then (they ride along with `rollbar`).
 *
 * This `checkIgnore` reads `window` (the bot / headless checks) and only ever runs in the browser.
 * The server-side error-page instance has its own config in `serverConfig.ts` and must not reuse
 * this predicate — see the note there.
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

      if (isIgnoredExceptionClass(item)) {
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

      if (isMonacoCdnError(item)) {
        return true;
      }

      if (isInjectedScriptError(item)) {
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

      // Opaque cross-origin script errors: the browser masks the details of an uncaught error
      // thrown by a different-origin script (CORS), leaving only this string with no stack or
      // payload. Unactionable, and sourced from third-party scripts we don't control.
      'Script error',

      // Benign browser signal, not a fault: fired when a ResizeObserver callback mutates layout
      // and the browser defers the remaining notifications to the next frame. The deferred
      // notifications still arrive, so there is no user-visible impact and nothing to fix. Comes
      // through as a message-only window error with no stack. Substring covers both spellings:
      // "...loop completed with undelivered notifications." and "...loop limit exceeded".
      'ResizeObserver loop',

      // WalletConnect/AppKit rejects a pending pairing when its TTL elapses before the user
      // completes the connect flow (opened the modal, walked away). Expected user behaviour, not a
      // fault, surfaced from vendored SDK code. Covers the whole expiry family since the noun
      // varies (proposal / pairing / session request) but "expired" is the shared, WC-specific tail.
      'Proposal expired',
      'Pairing expired',
      'Session request expired',
    ],
    maxItems: 10, // Max items per page load
    // uncaught / unhandledrejection coverage is owned by the early window listeners in queue.ts —
    // enabling Rollbar's built-in capture here would double-report
    captureUncaught: false,
    captureUnhandledRejections: false,
  };
}
