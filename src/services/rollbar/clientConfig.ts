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

      // Browser auto-translate and DOM-mutating extensions move nodes React owns, so its removeChild /
      // insertBefore / replaceChild fails with a NotFoundError. checkIgnore drops that class, but our error
      // boundary re-reports it as a message with no trace, so match the tail all three errors share.
      'is not a child of this node',

      // WalletConnect/AppKit rejects a pending pairing when its TTL elapses before the user
      // completes the connect flow (opened the modal, walked away). Expected user behaviour, not a
      // fault, surfaced from vendored SDK code. Covers the whole expiry family since the noun
      // varies (proposal / pairing / session request) but "expired" is the shared, WC-specific tail.
      'Proposal expired',
      'Pairing expired',
      'Session request expired',

      // The WalletConnect relay rejects the auth JWT its client SDK signs with the device clock when
      // that clock is skewed ("not yet valid" when ahead, "expired" when behind), closing the socket
      // with code 3000. A wrong system clock on the visitor's machine, not a fault we can fix; the
      // timestamps in the message make every burst a new title, so match the shared relay prefix.
      'JWT validation error',

      // React Query's CancelledError constructor sets `this.revert` after `super()`, which only throws when the
      // page's global `Error` was replaced by one returning a non-extensible object. Automation stacks patch it
      // this way (datacenter IPs, no plugins, rate-limited); a stock browser never does. Each release's chunk
      // names give the trace a new fingerprint, so a mute does not hold across releases.
      'Cannot add property revert, object is not extensible',
    ],
    maxItems: 10, // Max items per page load
    // uncaught / unhandledrejection coverage is owned by the early window listeners in queue.ts —
    // enabling Rollbar's built-in capture here would double-report
    captureUncaught: false,
    captureUnhandledRejections: false,
  };
}
