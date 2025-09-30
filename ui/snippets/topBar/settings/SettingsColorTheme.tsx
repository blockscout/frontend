import { Box, Flex } from '@chakra-ui/react';
import React from 'react';

import type { ColorThemeId } from 'types/settings';

import config from 'configs/app';
import * as cookies from 'lib/cookies';
import { COLOR_THEMES, getDefaultColorTheme, getThemeHexWithOverrides } from 'lib/settings/colorTheme';
import type { ColorMode } from 'toolkit/chakra/color-mode';
import { useColorMode } from 'toolkit/chakra/color-mode';

import SettingsSample from './SettingsSample';

const SettingsColorTheme = () => {
  const { setColorMode } = useColorMode();

  const [ activeThemeId, setActiveThemeId ] = React.useState<ColorThemeId>();

  const setTheme = React.useCallback((themeId: ColorThemeId) => {
    const nextTheme = COLOR_THEMES.find((theme) => theme.id === themeId);
    const varValue = getThemeHexWithOverrides(themeId, config.UI.colorTheme.overrides);

    if (!nextTheme || !varValue) {
      return;
    }

    const varName = nextTheme.colorMode === 'light' ? '--chakra-colors-white' : '--chakra-colors-black';
    window.document.documentElement.style.setProperty(varName, varValue);

    cookies.set(cookies.NAMES.COLOR_MODE, nextTheme.colorMode);
    cookies.set(cookies.NAMES.COLOR_THEME, themeId);
    window.localStorage.setItem(cookies.NAMES.COLOR_MODE, nextTheme.colorMode);
    setColorMode(nextTheme.colorMode);
  }, [ setColorMode ]);

  React.useEffect(() => {
    const cookieColorMode = cookies.get(cookies.NAMES.COLOR_MODE) as ColorMode | undefined;
    const cookieColorTheme = cookies.get(cookies.NAMES.COLOR_THEME) as ColorThemeId | undefined;

    const nextColorMode = cookieColorMode || 'dark';
    const nextColorTheme = cookieColorTheme || getDefaultColorTheme(nextColorMode);

    setTheme(nextColorTheme);
    setActiveThemeId(nextColorTheme);
  // should run only on mount
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ ]);

  const handleSelect = React.useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    const themeId = event.currentTarget.getAttribute('data-value') as ColorThemeId | null;

    if (!themeId) {
      return;
    }

    setTheme(themeId);
    setActiveThemeId(themeId);
  }, [ setTheme ]);

  const activeTheme = COLOR_THEMES.find((theme) => theme.id === activeThemeId);

  return (
    <div>
      <Box fontWeight={ 600 }>Color theme</Box>
      <Box color="text.secondary" mt={ 1 } mb={ 2 }>{ activeTheme?.label }</Box>
      <Flex>
        { COLOR_THEMES.map((theme) => {
          return (
            <SettingsSample
              key={ theme.label }
              label={ theme.label }
              value={ theme.id }
              bg={ theme.sampleBg }
              isActive={ theme.id === activeThemeId }
              onClick={ handleSelect }
            />
          );
        }) }
      </Flex>
    </div>
  );
};

export default React.memo(SettingsColorTheme);
