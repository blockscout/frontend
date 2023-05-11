import { useRouter } from 'next/router';
import React from 'react';

import appConfig from 'configs/app/config';
import getQueryParamString from 'lib/router/getQueryParamString';

import getPageType from './getPageType';
import getTabName from './getTabName';
import logEvent from './logEvent';
import { EventTypes } from './utils';

export default function useLogPageView(isInited: boolean) {
  const router = useRouter();

  const pathname = router.pathname;
  const tab = getQueryParamString(router.query.tab);
  const page = getQueryParamString(router.query.page);

  React.useEffect(() => {
    if (!appConfig.mixpanel.projectToken || !isInited) {
      return;
    }

    logEvent(EventTypes.PAGE_VIEW, {
      'Page type': getPageType(pathname),
      Tab: getTabName(tab),
      Page: page || undefined,
    });
  }, [ isInited, page, pathname, tab ]);
}
