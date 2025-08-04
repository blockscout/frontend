import { Box, Flex } from '@chakra-ui/react';
import React from 'react';

import * as cookies from 'lib/cookies';
import { COLOR_THEMES, getThemeHexWithOverrides } from 'lib/settings/colorTheme';
import { useColorMode } from 'toolkit/chakra/color-mode';

import SettingsSample from './SettingsSample';

interface Props {
  onSelect?: () => void;
}

const SettingsColorTheme = ({ onSelect }: Props) => {
  const { setColorMode } = useColorMode();

  const [ activeHex, setActiveHex ] = React.useState<string>();

  const setTheme = React.useCallback((hexWithOverrides: string) => {
    const nextTheme = COLOR_THEMES.find((theme) => getThemeHexWithOverrides(theme.id) === hexWithOverrides);

    if (!nextTheme) {
      return;
    }

    setColorMode(nextTheme.colorMode);

    const varName = nextTheme.colorMode === 'light' ? '--chakra-colors-white' : '--chakra-colors-black';
    window.document.documentElement.style.setProperty(varName, hexWithOverrides);

    cookies.set(cookies.NAMES.COLOR_MODE_HEX, hexWithOverrides);
    cookies.set(cookies.NAMES.COLOR_MODE, nextTheme.colorMode);
    window.localStorage.setItem(cookies.NAMES.COLOR_MODE, nextTheme.colorMode);
  }, [ setColorMode ]);

  React.useEffect(() => {
    const cookieColorMode = cookies.get(cookies.NAMES.COLOR_MODE);

    const nextColorMode = (() => {
      if (!cookieColorMode) {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      }

      return cookieColorMode;
    })();

    const colorModeThemes = COLOR_THEMES.filter(theme => theme.colorMode === nextColorMode);
    const fallbackHex = getThemeHexWithOverrides(colorModeThemes[colorModeThemes.length - 1].id);
    const cookieHex = window.decodeURIComponent(cookies.get(cookies.NAMES.COLOR_MODE_HEX) ?? fallbackHex ?? '');
    setTheme(cookieHex);
    setActiveHex(cookieHex);
  // should run only on mount
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ ]);

  const handleSelect = React.useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();

    const hex = event.currentTarget.getAttribute('data-value');

    if (!hex) {
      return;
    }

    setTheme(hex);
    setActiveHex(hex);
    onSelect?.();
  }, [ setTheme, onSelect ]);

  const activeTheme = COLOR_THEMES.find((theme) => getThemeHexWithOverrides(theme.id) === activeHex);

  return (
    <div>
      <Box fontWeight={ 600 }>Color theme</Box>
      <Box color="text.secondary" mt={ 1 } mb={ 2 }>{ activeTheme?.label }</Box>
      <Flex>
        { COLOR_THEMES.map((theme) => {
          const value = getThemeHexWithOverrides(theme.id);

          if (!value) {
            return null;
          }

          return (
            <SettingsSample
              key={ theme.label }
              label={ theme.label }
              value={ value }
              bg={ theme.sampleBg }
              isActive={ value === activeHex }
              onClick={ handleSelect }
            />
          );
        }) }
      </Flex>
    </div>
  );
};

export default React.memo(SettingsColorTheme);
