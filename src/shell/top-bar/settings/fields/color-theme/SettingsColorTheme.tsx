// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { SettingsControlVariant } from '../../types';

import config from 'src/config';
import * as cookies from 'src/shared/storage/cookies';

import type { ColorMode } from 'src/toolkit/chakra/color-mode';
import { useColorMode } from 'src/toolkit/chakra/color-mode';

import { useSettingsContext } from '../../context';
import SettingsSample from '../../parts/SettingsSample';
import SettingsSamplesRow from '../../parts/SettingsSamplesRow';
import type { ColorThemeId } from './config';
import { SYSTEM_COLOR_THEME_ID, isConcreteColorTheme } from './config';
import { getInitialColorTheme, getThemeHexWithOverrides, resolveColorTheme } from './utils';

const MIN_THEMES_FOR_SWITCHER = 2;
const PREFERS_DARK_QUERY = '(prefers-color-scheme: dark)';

const availableThemes = config.shell.topBar.colorTheme.themes;
const concreteThemes = availableThemes.filter(isConcreteColorTheme);

interface Props {
  onSelect?: () => void;
  variant?: SettingsControlVariant;
}

const SettingsColorTheme = ({ onSelect, variant = 'popover' }: Props) => {
  const { setColorMode } = useColorMode();
  const settingsContext = useSettingsContext();

  const activeThemeId = settingsContext?.colorTheme;
  const setActiveThemeId = settingsContext?.setColorTheme;

  const applyTheme = React.useCallback((themeId: ColorThemeId, prefersDark: boolean) => {
    const concreteThemeId = resolveColorTheme(themeId, prefersDark);
    const concreteTheme = concreteThemes.find((theme) => theme.id === concreteThemeId);
    const varValue = getThemeHexWithOverrides(concreteThemeId);

    // Stryker disable next-line ConditionalExpression,LogicalOperator: the id is one of the offered themes, so neither lookup can miss; the guard narrows types
    if (!concreteTheme || !varValue) {
      return;
    }

    setColorMode(themeId === SYSTEM_COLOR_THEME_ID ? SYSTEM_COLOR_THEME_ID : concreteTheme.colorMode);

    const varName = concreteTheme.colorMode === 'light' ? '--chakra-colors-white' : '--chakra-colors-black';
    const varNameBg = concreteTheme.colorMode === 'light' ? '--chakra-colors-theme-bg-primary-_light' : '--chakra-colors-theme-bg-primary-_dark';
    window.document.documentElement.style.setProperty(varName, varValue);
    window.document.documentElement.style.setProperty(varNameBg, varValue);

    cookies.set(cookies.NAMES.COLOR_MODE, concreteTheme.colorMode);
    cookies.set(cookies.NAMES.COLOR_THEME, themeId);
    window.localStorage.setItem(cookies.NAMES.COLOR_MODE, concreteTheme.colorMode);
  }, [ setColorMode ]);

  React.useEffect(() => {
    const prefersDark = window.matchMedia(PREFERS_DARK_QUERY).matches;
    const nextColorTheme = getInitialColorTheme({
      cookieColorMode: cookies.get(cookies.NAMES.COLOR_MODE) as ColorMode | undefined,
      cookieColorTheme: cookies.get(cookies.NAMES.COLOR_THEME),
      prefersDark,
    });

    applyTheme(nextColorTheme, prefersDark);
    setActiveThemeId?.(nextColorTheme);
  // should run only on mount
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ ]);

  React.useEffect(() => {
    if (activeThemeId !== SYSTEM_COLOR_THEME_ID) {
      return;
    }

    const mediaQuery = window.matchMedia(PREFERS_DARK_QUERY);
    const handleChange = (event: MediaQueryListEvent) => applyTheme(SYSTEM_COLOR_THEME_ID, event.matches);
    mediaQuery.addEventListener('change', handleChange);

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [ activeThemeId, applyTheme ]);

  const handleSelect = React.useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();

    const themeId = event.currentTarget.getAttribute('data-value') as ColorThemeId | null;

    if (!themeId) {
      return;
    }

    applyTheme(themeId, window.matchMedia(PREFERS_DARK_QUERY).matches);
    setActiveThemeId?.(themeId);
    onSelect?.();
  }, [ applyTheme, setActiveThemeId, onSelect ]);

  const activeTheme = availableThemes.find((theme) => theme.id === activeThemeId);

  if (concreteThemes.length < MIN_THEMES_FOR_SWITCHER) {
    return null;
  }

  return (
    <SettingsSamplesRow variant={ variant } title="Color theme" mobileTitle="Theme" value={ activeTheme?.label }>
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
    </SettingsSamplesRow>
  );
};

export default React.memo(SettingsColorTheme);
