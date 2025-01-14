import { Provider as DefaultProvider, useRollbar as useRollbarDefault } from '@rollbar/react';
import type React from 'react';
import type { Configuration } from 'rollbar';

import config from 'configs/app';
import { ABSENT_PARAM_ERROR_MESSAGE } from 'lib/errors/throwOnAbsentParamError';
import { RESOURCE_LOAD_ERROR_MESSAGE } from 'lib/errors/throwOnResourceLoadError';

import { isBot, isHeadlessBrowser, isNextJsChunkError, getRequestInfo } from './utils';

const feature = config.features.rollbar;

const FallbackProvider = ({ children }: { children: React.ReactNode }) => children;

const useRollbarFallback = (): undefined => {};

export const Provider = feature.isEnabled ? DefaultProvider : FallbackProvider;
export const useRollbar = feature.isEnabled ? useRollbarDefault : useRollbarFallback;

export const clientConfig: Configuration | undefined = feature.isEnabled ? {
  accessToken: feature.clientToken,
  environment: feature.environment,
  payload: {
    code_version: feature.codeVersion,
    app_instance: feature.instance,
  },
  checkIgnore(isUncaught, args, item) {
    if (isBot(window.navigator.userAgent)) {
      return true;
    }

    if (isHeadlessBrowser(window.navigator.userAgent)) {
      return true;
    }

    if (isNextJsChunkError(getRequestInfo(item)?.url)) {
      return true;
    }

    return false;
  },
  hostSafeList: [ config.app.host ].filter(Boolean),
  ignoredMessages: [
    // these are React errors - "NotFoundError: Failed to execute 'removeChild' on 'Node': The node to be removed is not a child of this node."
    // they could be caused by browser extensions
    // one of the examples - https://github.com/facebook/react/issues/11538
    // we can ignore them for now
    'NotFoundError',

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
} : undefined;
