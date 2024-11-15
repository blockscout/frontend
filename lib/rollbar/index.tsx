import { Provider as DefaultProvider, useRollbar as useRollbarDefault } from '@rollbar/react';
import type React from 'react';
import type { Configuration } from 'rollbar';

import config from 'configs/app';

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
} : undefined;
