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
  isIgnoredExceptionClass,
  isMonacoCdnError,
} from './utils';

/**
 * Rollbar client options — imported only once the SDK chunk is loaded so the ignore helpers and
 * message constants stay out of the critical path until then (they ride along with `rollbar`).
 *
 * This `checkIgnore` reads `window` (the bot / headless checks) and only ever runs in the browser.
 * The server-side error-page instance has its own config in `serverConfig.ts` and must not reuse
 * this predicate — see the note there.
 *
 * Uncaught errors are already filtered by origin in the queue's early listener (only our own
 * `/_next/` bundle is forwarded), so the rules here handle what still gets through: explicit
 * `rollbar` calls, and own-bundle traces that reach third-party code deeper in the stack.
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

      if (isMonacoCdnError(item)) {
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

      // Browser auto-translate (Google Translate et al.) and DOM-mutating extensions move nodes
      // React owns, so React's commit-phase removeChild / insertBefore / replaceChild then fails
      // with a NotFoundError. Environmental and unactionable — React owns that DOM, the only way a
      // node "is not a child" is an outside mutation. The NotFoundError class is already dropped via
      // checkIgnore, but our error boundary re-reports it as a message (no body.trace), which the
      // class check can't see — so match the shared DOM-exception tail here too. Covers all three
      // node ops (…removeChild/insertBefore/replaceChild… "is not a child of this node.").
      'is not a child of this node',

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
