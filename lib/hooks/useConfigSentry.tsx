import * as Sentry from '@sentry/react';
import React from 'react';

import { config, configureScope } from 'configs/sentry/react';

export default function useConfigSentry() {
  React.useEffect(() => {
    // gotta init sentry in browser
    Sentry.init(config);
    Sentry.configureScope(configureScope);
  }, []);
}
