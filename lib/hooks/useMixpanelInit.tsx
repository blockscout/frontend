import mixpanel from 'mixpanel-browser';
import React from 'react';

import appConfig from 'configs/app/config';

export default function useMixpanelInit() {
  React.useEffect(() => {
    if (appConfig.mixpanel.projectToken) {
      const config = {
        debug: appConfig.isDev,
      };
      mixpanel.init(appConfig.mixpanel.projectToken, config);
    }
  }, []);
}
