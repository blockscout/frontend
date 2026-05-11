import React from 'react';

import useUsercentricsConsent from 'client/shared/analytics/usercentrics/useUsercentricsConsent';

import config from 'configs/app';

import { clientConfig } from './config';

export default function useRollbarConfig() {

  const hasUsercentricsConsent = useUsercentricsConsent();

  return React.useMemo(() => {
    if (!config.features.usercentrics.isEnabled) {
      return;
    }
    return hasUsercentricsConsent ? clientConfig : { ...clientConfig, enabled: false };
  }, [ hasUsercentricsConsent ]);
}
