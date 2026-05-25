// SPDX-License-Identifier: LicenseRef-Blockscout

import { usePathname } from 'next/navigation';
import { useRouter } from 'next/router';
import React from 'react';

import getQueryParamString from 'client/shared/router/get-query-param-string';

import config from 'configs/app';

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
