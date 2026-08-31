// SPDX-License-Identifier: LicenseRef-Blockscout

import { usePathname } from 'next/navigation';
import { useRouter } from 'next/router';
import React from 'react';

import type { ColorThemeId } from 'src/shell/top-bar/settings/color-theme/config';
import { getDefaultColorTheme } from 'src/shell/top-bar/settings/color-theme/utils';

import config from 'src/config';
import getQueryParamString from 'src/shared/router/get-query-param-string';
import * as cookies from 'src/shared/storage/cookies';

import { useColorMode } from 'src/toolkit/chakra/color-mode';

import getPageType from './get-page-type';
import getTabName from './get-tab-name';
import logEvent from './log-event';
import { EventTypes } from './utils';

export default function useLogPageView(isInitialized: boolean) {
  const router = useRouter();
  const pathname = usePathname();

  const tab = getQueryParamString(router.query.tab);
  const page = getQueryParamString(router.query.page);
  const id = getQueryParamString(router.query.id);
  const { colorMode } = useColorMode();

  React.useEffect(() => {
    if (!config.services.mixpanel.projectToken || !isInitialized) {
      return;
    }

    const cookieColorTheme = cookies.get(cookies.NAMES.COLOR_THEME) as ColorThemeId | undefined;

    logEvent(EventTypes.PAGE_VIEW, {
      'Page type': getPageType(router.pathname),
      Tab: getTabName(tab),
      Page: page || undefined,
      Source: router.pathname === '/essential-dapps/[id]' ? id : undefined,
      'Color mode': colorMode,
      'Color theme': cookieColorTheme || getDefaultColorTheme(colorMode),
    });
    // these are only deps that should trigger the effect
    // in some scenarios page type is not changing (e.g navigation from one address page to another),
    // but we still want to log page view
    // so we use pathname from 'next/navigation' instead of router.pathname from 'next/router' as deps
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ isInitialized, page, pathname, tab, colorMode ]);
}
