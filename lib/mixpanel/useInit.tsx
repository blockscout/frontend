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

import * as userProfile from './userProfile';

export default function useMixpanelInit() {
  const [ isInited, setIsInited ] = React.useState(false);
  const router = useRouter();
  const debugFlagQuery = React.useRef(getQueryParamString(router.query._mixpanel_debug));

  React.useEffect(() => {
    const feature = config.features.mixpanel;
    if (!feature.isEnabled) {
      return;
    }

    const debugFlagCookie = cookies.get(cookies.NAMES.MIXPANEL_DEBUG);

    const mixpanelConfig: Partial<Config> = {
      debug: Boolean(debugFlagQuery.current || debugFlagCookie),
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
    });
    mixpanel.identify(uuid);
    userProfile.set({
      'Device Type': capitalize(deviceType),
      ...(isAuth ? { 'With Account': true } : {}),
    });
    userProfile.setOnce({
      'First Time Join': dayjs().toISOString(),
    });

    setIsInited(true);
    if (debugFlagQuery.current && !debugFlagCookie) {
      cookies.set(cookies.NAMES.MIXPANEL_DEBUG, 'true');
    }
  }, [ ]);

  return isInited;
}
