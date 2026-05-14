// SPDX-License-Identifier: LicenseRef-Blockscout

import { capitalize } from 'es-toolkit';
import type { Config } from 'mixpanel-browser';
import mixpanel from 'mixpanel-browser';
import { useRouter } from 'next/router';
import React from 'react';
import { deviceType } from 'react-device-detect';

import getQueryParamString from 'client/shared/router/get-query-param-string';
import * as cookies from 'client/shared/storage/cookies';

import config from 'configs/app';
import dayjs from 'lib/date/dayjs';

import * as userProfile from './user-profile';

const multichainFeature = config.features.multichain;

export default function useMixpanelInit() {
  const [ isInitialized, setIsInitialized ] = React.useState(false);
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
      ...(multichainFeature.isEnabled ? { 'Cluster name': multichainFeature.cluster } : {}),
    });
    mixpanel.identify(uuid);
    userProfile.set({
      'Device Type': capitalize(deviceType),
      ...(isAuth ? { 'With Account': true } : {}),
    });
    userProfile.setOnce({
      'First Time Join': dayjs().toISOString(),
    });

    setIsInitialized(true);
    if (debugFlagQuery.current && !debugFlagCookie) {
      cookies.set(cookies.NAMES.MIXPANEL_DEBUG, 'true');
    }
  }, [ ]);

  return isInitialized;
}
