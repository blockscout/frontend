import { useColorMode } from '@chakra-ui/react';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/router';
import React from 'react';

import config from 'configs/app';
import getQueryParamString from 'lib/router/getQueryParamString';

import getPageType from './getPageType';
import getTabName from './getTabName';
import logEvent from './logEvent';
import { EventTypes } from './utils';

export default function useLogPageView(isInited: boolean) {
  const router = useRouter();
  const pathname = usePathname();

  const tab = getQueryParamString(router.query.tab);
  const page = getQueryParamString(router.query.page);
  const { colorMode } = useColorMode();

  React.useEffect(() => {
    if (!config.features.mixpanel.isEnabled || !isInited) {
      return;
    }

    logEvent(EventTypes.PAGE_VIEW, {
      'Page type': getPageType(router.pathname),
      Tab: getTabName(tab),
      Page: page || undefined,
      'Color mode': colorMode,
    });
    // these are only deps that should trigger the effect
    // in some scenarios page type is not changing (e.g navigation from one address page to another),
    // but we still want to log page view
    // so we use pathname from 'next/navigation' instead of router.pathname from 'next/router' as deps
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ isInited, page, pathname, tab, colorMode ]);
}
