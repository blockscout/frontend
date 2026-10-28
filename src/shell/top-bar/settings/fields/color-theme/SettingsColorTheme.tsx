// SPDX-License-Identifier: LicenseRef-Blockscout

import { Flex } from '@chakra-ui/react';
import React from 'react';

import type { SettingsControlVariant } from '../../types';

import config from 'src/config';
import useIsMobile from 'src/shared/hooks/useIsMobile';
import * as cookies from 'src/shared/storage/cookies';

import type { ColorMode } from 'src/toolkit/chakra/color-mode';
import { useColorMode } from 'src/toolkit/chakra/color-mode';

import { useSettingsContext } from '../../context';
import SettingsSample from '../../parts/SettingsSample';
import SettingsSampleValue from '../../parts/SettingsSampleValue';
import SettingsSectionTitle from '../../parts/SettingsSectionTitle';
import type { ColorThemeId } from './config';
import { getInitialColorTheme, getThemeHexWithOverrides } from './utils';

const MIN_THEMES_FOR_SWITCHER = 2;

const availableThemes = config.shell.topBar.colorTheme.themes;

interface Props {
  onSelect?: () => void;
  variant?: SettingsControlVariant;
}

const SettingsColorTheme = ({ onSelect, variant = 'popover' }: Props) => {
  const { setColorMode } = useColorMode();
  const settingsContext = useSettingsContext();
  const isMobile = useIsMobile();

  const activeThemeId = settingsContext?.colorTheme;
  const setActiveThemeId = settingsContext?.setColorTheme;

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
    setActiveThemeId?.(themeId);
  }, [ setColorMode, setActiveThemeId ]);

  React.useEffect(() => {
    const nextColorTheme = getInitialColorTheme({
      cookieColorMode: cookies.get(cookies.NAMES.COLOR_MODE) as ColorMode | undefined,
      cookieColorTheme: cookies.get(cookies.NAMES.COLOR_THEME),
      prefersDark: window.matchMedia('(prefers-color-scheme: dark)').matches,
    });

    setTheme(nextColorTheme);
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
    onSelect?.();
  }, [ setTheme, onSelect ]);

  const activeTheme = availableThemes.find((theme) => theme.id === activeThemeId);

  if (availableThemes.length < MIN_THEMES_FOR_SWITCHER) {
    return null;
  }

  const showSectionTitle = !isMobile || variant === 'popover';

  return (
    <div>
      { showSectionTitle && <SettingsSectionTitle variant={ variant } title="Color theme"/> }
      <SettingsSampleValue variant={ variant } value={ activeTheme?.label } prefix={ showSectionTitle ? undefined : 'Color theme: ' }/>
      <Flex gap={ variant === 'modal' ? 2 : 0 }>
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
  );
};

export default React.memo(SettingsColorTheme);
