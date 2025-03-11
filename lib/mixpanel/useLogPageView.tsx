import { usePathname } from 'next/navigation';
import { useRouter } from 'next/router';
import React from 'react';

import config from 'configs/app';
import * as cookies from 'lib/cookies';
import getQueryParamString from 'lib/router/getQueryParamString';
import { COLOR_THEMES } from 'lib/settings/colorTheme';
import { useColorMode } from 'toolkit/chakra/color-mode';
import type { ColorMode } from 'toolkit/chakra/color-mode';

import getPageType from './getPageType';
import getTabName from './getTabName';
import logEvent from './logEvent';
import { EventTypes } from './utils';

function getColorTheme(hex: string | undefined, colorMode: ColorMode) {
  const colorTheme = COLOR_THEMES.find((theme) => theme.hex === hex) ||
    COLOR_THEMES.filter((theme) => theme.colorMode === colorMode).slice(-1)[0];

  return colorTheme.id;
}

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

    const cookieColorModeHex = cookies.get(cookies.NAMES.COLOR_MODE_HEX);

    logEvent(EventTypes.PAGE_VIEW, {
      'Page type': getPageType(router.pathname),
      Tab: getTabName(tab),
      Page: page || undefined,
      'Color mode': colorMode,
      'Color theme': getColorTheme(cookieColorModeHex, colorMode),
    });
    // these are only deps that should trigger the effect
    // in some scenarios page type is not changing (e.g navigation from one address page to another),
    // but we still want to log page view
    // so we use pathname from 'next/navigation' instead of router.pathname from 'next/router' as deps
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ isInited, page, pathname, tab, colorMode ]);
}
