import React from 'react';

import useUsercentricsConsent from 'client/shared/analytics/usercentrics/useUsercentricsConsent';

import config from 'configs/app';

import { clientConfig } from './config';

export default function useRollbarConfig() {

  const usercentricsConsent = useUsercentricsConsent();

  return React.useMemo(() => {
    if (!config.features.usercentrics.isEnabled) {
      return;
    }
    return usercentricsConsent?.rollbar ? clientConfig : { ...clientConfig, enabled: false };
  }, [ usercentricsConsent?.rollbar ]);
}
