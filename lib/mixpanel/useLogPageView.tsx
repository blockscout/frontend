import mixpanel from 'mixpanel-browser';
import { useRouter } from 'next/router';
import React from 'react';

import appConfig from 'configs/app/config';
import getQueryParamString from 'lib/router/getQueryParamString';

import getPageType from './getPageType';
import getTabName from './getTabName';

export default function useLogPageView(isInited: boolean) {
  const router = useRouter();

  const pathname = router.pathname;
  const tab = getQueryParamString(router.query.tab);

  React.useEffect(() => {
    if (!appConfig.mixpanel.projectToken || !isInited) {
      return;
    }

    mixpanel.track('Page view', {
      page_type: getPageType(pathname),
      tab: getTabName(tab),
    });
  }, [ isInited, pathname, tab ]);
}
