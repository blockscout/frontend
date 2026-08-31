// SPDX-License-Identifier: LicenseRef-Blockscout

import { capitalize } from 'es-toolkit';
import type { Config } from 'mixpanel-browser';
import { useRouter } from 'next/router';
import React from 'react';
import { deviceType } from 'react-device-detect';

import config from 'src/config';
import dayjs from 'src/shared/date-and-time/dayjs';
import getQueryParamString from 'src/shared/router/get-query-param-string';
import * as cookies from 'src/shared/storage/cookies';

import { SECOND } from 'src/toolkit/utils/consts';

import * as queue from './queue';

const multichainFeature = config.features.multichain;

// upper bound for the idle-callback deferral, so init is not postponed indefinitely on busy pages
const IDLE_INIT_TIMEOUT = 2 * SECOND;

export default function useMixpanelInit() {
  const [ isInitialized, setIsInitialized ] = React.useState(false);
  const router = useRouter();
  const debugFlagQuery = React.useRef(getQueryParamString(router.query._mixpanel_debug));

  React.useEffect(() => {
    const projectToken = config.services.mixpanel.projectToken;
    if (!projectToken) {
      return;
    }

    // cookie-derived state is captured at mount so that the deferred init sees the same values
    // a synchronous init would have (auth may change while init waits for an idle slot)
    const debugFlagCookie = cookies.get(cookies.NAMES.MIXPANEL_DEBUG);
    const isAuth = Boolean(cookies.get(cookies.NAMES.API_TOKEN));
    const uuid = cookies.get(cookies.NAMES.UUID);

    const startInit = async() => {
      const mixpanelConfig: Partial<Config> = {
        debug: Boolean(debugFlagQuery.current || debugFlagCookie),
        persistence: 'localStorage',
        api_host: 'https://api-eu.mixpanel.com',
        ...config.services.mixpanel.configOverrides,
      };

      const isReady = await queue.init(projectToken, mixpanelConfig, (mixpanel) => {
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
        // profile writes belong before the queue flush — a buffered `reset` (logout during
        // the deferral window) must not leave them on the anonymous post-reset profile
        mixpanel.people.set({
          'Device Type': capitalize(deviceType),
          ...(isAuth ? { 'With Account': true } : {}),
        });
        mixpanel.people.set_once({
          'First Time Join': dayjs().toISOString(),
        });
      });

      if (!isReady) {
        return;
      }

      setIsInitialized(true);
      if (debugFlagQuery.current && !debugFlagCookie) {
        cookies.set(cookies.NAMES.MIXPANEL_DEBUG, 'true');
      }
    };

    if (typeof window.requestIdleCallback === 'function') {
      const idleCallbackId = window.requestIdleCallback(startInit, { timeout: IDLE_INIT_TIMEOUT });
      return () => window.cancelIdleCallback(idleCallbackId);
    }

    const timeoutId = window.setTimeout(startInit, 0);
    return () => window.clearTimeout(timeoutId);
  }, []);

  return isInitialized;
}
