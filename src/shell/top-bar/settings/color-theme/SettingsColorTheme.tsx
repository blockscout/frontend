// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box, Flex, Separator } from '@chakra-ui/react';
import React from 'react';

import config from 'src/config';
import * as cookies from 'src/shared/storage/cookies';

import type { ColorMode } from 'src/toolkit/chakra/color-mode';
import { useColorMode } from 'src/toolkit/chakra/color-mode';

import SettingsSample from '../SettingsSample';
import type { ColorThemeId } from './config';
import { getDefaultColorTheme, getThemeHexWithOverrides, isColorThemeAvailable } from './utils';

const MIN_THEMES_FOR_SWITCHER = 2;

const availableThemes = config.shell.topBar.colorTheme.themes;

interface Props {
  onSelect?: () => void;
}

const SettingsColorTheme = ({ onSelect }: Props) => {
  const { setColorMode } = useColorMode();

  const [ activeThemeId, setActiveThemeId ] = React.useState<ColorThemeId>();

  const setTheme = React.useCallback((themeId: ColorThemeId) => {
    const nextTheme = availableThemes.find((theme) => theme.id === themeId);
    const varValue = getThemeHexWithOverrides(themeId);

    if (!nextTheme || !varValue) {
      return;
    }

    setColorMode(nextTheme.colorMode);

    const varName = nextTheme.colorMode === 'light' ? '--chakra-colors-white' : '--chakra-colors-black';
    const varNameBg = nextTheme.colorMode === 'light' ? '--chakra-colors-theme-bg-primary-_light' : '--chakra-colors-theme-bg-primary-_dark';
    window.document.documentElement.style.setProperty(varName, varValue);
    window.document.documentElement.style.setProperty(varNameBg, varValue);

    cookies.set(cookies.NAMES.COLOR_MODE, nextTheme.colorMode);
    cookies.set(cookies.NAMES.COLOR_THEME, themeId);
    window.localStorage.setItem(cookies.NAMES.COLOR_MODE, nextTheme.colorMode);
  }, [ setColorMode ]);

  React.useEffect(() => {
    const cookieColorMode = cookies.get(cookies.NAMES.COLOR_MODE) as ColorMode | undefined;
    const cookieColorTheme = cookies.get(cookies.NAMES.COLOR_THEME) as ColorThemeId | undefined;

    const nextColorMode = (() => {
      if (!cookieColorMode) {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      }

      return cookieColorMode;
    })();

    const nextColorTheme = cookieColorTheme && isColorThemeAvailable(cookieColorTheme) ?
      cookieColorTheme :
      getDefaultColorTheme(nextColorMode);

    setTheme(nextColorTheme);
    setActiveThemeId(nextColorTheme);
  // should run only on mount
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ ]);

  const handleSelect = React.useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();

    const themeId = event.currentTarget.getAttribute('data-value') as ColorThemeId | null;

    if (!themeId) {
      return;
    }

    setTheme(themeId);
    setActiveThemeId(themeId);
    onSelect?.();
  }, [ setTheme, onSelect ]);

  const activeTheme = availableThemes.find((theme) => theme.id === activeThemeId);

  if (availableThemes.length < MIN_THEMES_FOR_SWITCHER) {
    return null;
  }

  return (
    <>
      <div>
        <Box fontWeight={ 600 }>Color theme</Box>
        <Box color="text.secondary" mt={ 1 } mb={ 2 }>{ activeTheme?.label }</Box>
        <Flex>
          { availableThemes.map((theme) => {
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
      <Separator my={ 3 }/>
    </>
  );
};

export default React.memo(SettingsColorTheme);
