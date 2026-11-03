// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import config from 'src/config';
import getQueryParamString from 'src/shared/router/get-query-param-string';
import { usePathname } from 'src/shared/router/usePathname';
import { useRouter } from 'src/shared/router/useRouter';

export default function useNotifyOnNavigation() {
  const router = useRouter();
  const pathname = usePathname();
  const tab = getQueryParamString(router.query.tab);

  React.useEffect(() => {
    if (config.features.metasuites.isEnabled) {
      window.postMessage({ source: 'APP_ROUTER', type: 'PATHNAME_CHANGED' }, window.location.origin);
    }
  }, [ pathname ]);

  React.useEffect(() => {
    if (config.features.metasuites.isEnabled) {
      window.postMessage({ source: 'APP_ROUTER', type: 'TAB_CHANGED' }, window.location.origin);
    }
  }, [ tab ]);
}
