import { capitalize } from 'es-toolkit';
import type { Config } from 'mixpanel-browser';
import mixpanel from 'mixpanel-browser';
import { useRouter } from 'next/router';
import React from 'react';
import { deviceType } from 'react-device-detect';

import config from 'configs/app';
import * as cookies from 'lib/cookies';
import dayjs from 'lib/date/dayjs';
import getQueryParamString from 'lib/router/getQueryParamString';
import useUsercentricsMarketingConsent from 'lib/usercentrics/useConsent';

import * as userProfile from './userProfile';

const opSuperchainFeature = config.features.opSuperchain;

export default function useMixpanelInit() {
  const [ isInitialized, setIsInitialized ] = React.useState(false);
  const router = useRouter();
  const hasConsent = useUsercentricsMarketingConsent();
  const debugFlagQuery = React.useRef(getQueryParamString(router.query._mixpanel_debug));
  const isInitializedRef = React.useRef(false);

  React.useEffect(() => {
    const feature = config.features.mixpanel;
    if (!feature.isEnabled) {
      return;
    }

    if (!hasConsent) {
      if (isInitializedRef.current) {
        // Consent was withdrawn after Mixpanel was already running — stop all tracking
        isInitializedRef.current = false;
        setIsInitialized(false);
        try {
          mixpanel.opt_out_tracking();
        } catch {
          // opt_out_tracking can throw if called before Mixpanel's internal state is ready
          mixpanel.disable();
        }
      }
      return;
    }

    const debugFlagCookie = cookies.get(cookies.NAMES.MIXPANEL_DEBUG);

    const mixpanelConfig: Partial<Config> = {
      debug: Boolean(debugFlagQuery.current || debugFlagCookie),
      persistence: 'localStorage',
      ...feature.configOverrides,
    };
    const isAuth = Boolean(cookies.get(cookies.NAMES.API_TOKEN));

    const uuid = cookies.get(cookies.NAMES.UUID);

    mixpanel.init(feature.projectToken, mixpanelConfig);
    mixpanel.register({
      'Chain id': config.chain.id,
      Environment: config.app.isDev ? 'Dev' : 'Prod',
      Authorized: isAuth,
      'Viewport width': window.innerWidth,
      'Viewport height': window.innerHeight,
      Language: window.navigator.language,
      'Device type': capitalize(deviceType),
      'User id': uuid,
      ...(opSuperchainFeature.isEnabled ? { 'Cluster name': opSuperchainFeature.cluster } : {}),
    });
    mixpanel.identify(uuid);
    userProfile.set({
      'Device Type': capitalize(deviceType),
      ...(isAuth ? { 'With Account': true } : {}),
    });
    userProfile.setOnce({
      'First Time Join': dayjs().toISOString(),
    });

    isInitializedRef.current = true;
    setIsInitialized(true);
    if (debugFlagQuery.current && !debugFlagCookie) {
      cookies.set(cookies.NAMES.MIXPANEL_DEBUG, 'true');
    }
  }, [ hasConsent ]);

  return isInitialized;
}
