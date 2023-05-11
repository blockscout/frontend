import _capitalize from 'lodash/capitalize';
import type { Config } from 'mixpanel-browser';
import mixpanel from 'mixpanel-browser';
import React from 'react';
import { deviceType } from 'react-device-detect';

import appConfig from 'configs/app/config';
import * as cookies from 'lib/cookies';

import getGoogleAnalyticsClientId from './getGoogleAnalyticsClientId';

export default function useMixpanelInit() {
  const [ isInited, setIsInited ] = React.useState(false);

  React.useEffect(() => {
    if (!appConfig.mixpanel.projectToken) {
      return;
    }

    const config: Partial<Config> = {
      debug: appConfig.isDev,
    };
    const isAuth = Boolean(cookies.get(cookies.NAMES.API_TOKEN));
    const userId = getGoogleAnalyticsClientId();

    mixpanel.init(appConfig.mixpanel.projectToken, config);
    mixpanel.register({
      'Chain id': appConfig.network.id,
      Environment: appConfig.isDev ? 'Dev' : 'Prod',
      Authorized: isAuth,
      'Viewport width': window.innerWidth,
      'Viewport height': window.innerHeight,
      Language: window.navigator.language,
      'User id': userId,
      'Device type': _capitalize(deviceType),
    });

    setIsInited(true);
  }, []);

  return isInited;
}
