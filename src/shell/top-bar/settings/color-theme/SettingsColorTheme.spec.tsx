// @vitest-environment jsdom

import Cookies from 'js-cookie';
import React from 'react';

import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import type * as TestLib from 'vitest/lib';
import withEnvs from 'vitest/utils/mockEnvs';

const COLOR_MODE_COOKIE = 'chakra-ui-color-mode';
const COLOR_THEME_COOKIE = 'chakra-ui-color-theme';

type ChangeListener = (event: MediaQueryListEvent) => void;

interface PrefersColorSchemeStub {
  readonly switchTo: (nextPrefersDark: boolean) => void;
}

function stubPrefersColorScheme(prefersDark: boolean): PrefersColorSchemeStub {
  const listeners = new Set<ChangeListener>();
  let matches = prefersDark;

  const subscribe = (listener: ChangeListener) => {
    listeners.add(listener);
  };
  const unsubscribe = (listener: ChangeListener) => {
    listeners.delete(listener);
  };

  // jsdom has no matchMedia; the stub is typed loosely because MediaQueryList's overloads are not worth reproducing
  window.matchMedia = ((media: string) => ({
    get matches() {
      return matches;
    },
    media,
    onchange: null,
    addListener: subscribe,
    removeListener: unsubscribe,
    addEventListener: (_: string, listener: ChangeListener) => subscribe(listener),
    removeEventListener: (_: string, listener: ChangeListener) => unsubscribe(listener),
    dispatchEvent: () => false,
  })) as unknown as typeof window.matchMedia;

  return {
    switchTo(nextPrefersDark: boolean) {
      matches = nextPrefersDark;
      listeners.forEach((listener) => listener({ matches, media: '' } as MediaQueryListEvent));
    },
  };
}

let unmountRendered: (() => void) | undefined;

interface RenderedSettings {
  readonly screen: typeof TestLib.screen;
  readonly fireEvent: typeof TestLib.fireEvent;
  readonly act: typeof TestLib.act;
}

async function renderSettings(envs: Array<[ string, string ]> = []): Promise<RenderedSettings> {
  return withEnvs(envs, async() => {
    const { render, screen, fireEvent, act } = await import('vitest/lib');
    const { 'default': SettingsColorTheme } = await import('./SettingsColorTheme');

    const { unmount } = render(<SettingsColorTheme/>);
    unmountRendered = unmount;

    return { screen, fireEvent, act };
  });
}

function getSwatch(themeId: string): HTMLElement {
  const swatch = window.document.querySelector<HTMLElement>(`[data-value="${ themeId }"]`);
  if (!swatch) {
    throw new Error(`No swatch for theme ${ themeId }`);
  }
  return swatch;
}

function getSwatchIds(): Array<string | null> {
  return Array.from(window.document.querySelectorAll('[data-value]')).map((element) => element.getAttribute('data-value'));
}

describe('SettingsColorTheme', () => {
  beforeEach(() => {
    Cookies.remove(COLOR_MODE_COOKIE);
    Cookies.remove(COLOR_THEME_COOKIE);
    window.localStorage.clear();
  });

  afterEach(() => {
    unmountRendered?.();
    unmountRendered = undefined;
    window.document.documentElement.className = '';
    window.document.documentElement.removeAttribute('style');
  });

  it('offers the Auto (System) swatch after the concrete themes', async() => {
    stubPrefersColorScheme(false);
    await renderSettings();

    expect(getSwatchIds()).toEqual([ 'light', 'dim', 'midnight', 'dark', 'system' ]);
  });

  it('hides the Auto (System) swatch when the offered themes leave it out', async() => {
    stubPrefersColorScheme(false);
    await renderSettings([ [ 'NEXT_PUBLIC_COLOR_THEMES', '["light","dark"]' ] ]);

    expect(getSwatchIds()).toEqual([ 'light', 'dark' ]);
  });

  it('starts on the system theme on a first visit and paints the OS color mode', async() => {
    stubPrefersColorScheme(true);
    const { screen } = await renderSettings();

    expect(screen.getByText('Auto (System)')).toBeTruthy();
    expect(Cookies.get(COLOR_THEME_COOKIE)).toBe('system');
    expect(Cookies.get(COLOR_MODE_COOKIE)).toBe('dark');
  });

  it('follows the OS color mode live while the system theme is active', async() => {
    const os = stubPrefersColorScheme(false);
    const { act } = await renderSettings();

    expect(Cookies.get(COLOR_MODE_COOKIE)).toBe('light');

    await act(async() => os.switchTo(true));

    expect(Cookies.get(COLOR_THEME_COOKIE)).toBe('system');
    expect(Cookies.get(COLOR_MODE_COOKIE)).toBe('dark');
    expect(window.document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('stops following the OS once a concrete theme is picked', async() => {
    const os = stubPrefersColorScheme(false);
    const { screen, fireEvent, act } = await renderSettings();

    fireEvent.click(getSwatch('dim'));
    expect(screen.getByText('Dim')).toBeTruthy();
    expect(Cookies.get(COLOR_THEME_COOKIE)).toBe('dim');

    await act(async() => os.switchTo(false));

    expect(Cookies.get(COLOR_THEME_COOKIE)).toBe('dim');
    expect(Cookies.get(COLOR_MODE_COOKIE)).toBe('dark');
    expect(window.document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('keeps a concrete theme stored in the cookie instead of switching to the system theme', async() => {
    stubPrefersColorScheme(true);
    Cookies.set(COLOR_THEME_COOKIE, 'light');
    Cookies.set(COLOR_MODE_COOKIE, 'light');
    const { screen } = await renderSettings();

    expect(screen.getByText('Light')).toBeTruthy();
    expect(Cookies.get(COLOR_THEME_COOKIE)).toBe('light');
    expect(Cookies.get(COLOR_MODE_COOKIE)).toBe('light');
  });

  it('resolves the system theme to the darkest offered dark theme', async() => {
    stubPrefersColorScheme(true);
    const { screen } = await renderSettings([ [ 'NEXT_PUBLIC_COLOR_THEMES', '["light","midnight","system"]' ] ]);

    expect(screen.getByText('Auto (System)')).toBeTruthy();
    expect(Cookies.get(COLOR_MODE_COOKIE)).toBe('dark');
    expect(window.document.documentElement.style.getPropertyValue('--chakra-colors-black')).toBe('#1B2E48');
  });
});
