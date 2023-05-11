import type { Config } from 'mixpanel-browser';
import mixpanel from 'mixpanel-browser';
import React from 'react';

import appConfig from 'configs/app/config';

export default function useMixpanelInit() {
  const [ isInited, setIsInited ] = React.useState(false);

  React.useEffect(() => {
    if (appConfig.mixpanel.projectToken) {
      const config: Partial<Config> = {
        debug: appConfig.isDev,
        test: appConfig.isDev,
      };
      mixpanel.init(appConfig.mixpanel.projectToken, config);
      setIsInited(true);
    }
  }, []);

  return isInited;
}
