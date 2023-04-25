import { test, expect } from '@playwright/experimental-ct-react';
import React from 'react';

import contextWithEnvs from 'playwright/fixtures/contextWithEnvs';
import TestApp from 'playwright/TestApp';

import NetworkLogo from './NetworkLogo';

test.describe('placeholder logo', () => {
  const extendedTest = test.extend({
    context: contextWithEnvs([
      { name: 'NEXT_PUBLIC_NETWORK_LOGO', value: '' },
      { name: 'NEXT_PUBLIC_NETWORK_ICON', value: '' },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ]) as any,
  });

  extendedTest('+@desktop-xl +@dark-mode +@dark-mode-xl', async({ mount }) => {
    const component = await mount(
      <TestApp>
        <NetworkLogo/>
      </TestApp>,
    );

    await expect(component.locator('a')).toHaveScreenshot();
  });
});

test.describe('custom logo', () => {
  const LOGO_URL = 'https://localhost:3000/my-logo.png';
  const ICON_URL = 'https://localhost:3000/my-icon.png';
  const extendedTest = test.extend({
    context: contextWithEnvs([
      { name: 'NEXT_PUBLIC_NETWORK_LOGO', value: LOGO_URL },
      { name: 'NEXT_PUBLIC_NETWORK_ICON', value: ICON_URL },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ]) as any,
  });

  extendedTest('+@desktop-xl +@dark-mode +@dark-mode-xl', async({ mount, page }) => {
    await page.route(LOGO_URL, (route) => {
      return route.fulfill({
        status: 200,
        path: './playwright/network-logo.svg',
      });
    });
    await page.route(ICON_URL, (route) => {
      return route.fulfill({
        status: 200,
        path: './playwright/duck.svg',
      });
    });

    const component = await mount(
      <TestApp>
        <NetworkLogo/>
      </TestApp>,
    );

    await expect(component.locator('a')).toHaveScreenshot();
  });
});

test.describe('custom logo with dark option', () => {
  const LOGO_URL = 'https://localhost:3000/my-logo.png';
  const ICON_URL = 'https://localhost:3000/my-icon.png';
  const extendedTest = test.extend({
    context: contextWithEnvs([
      { name: 'NEXT_PUBLIC_NETWORK_LOGO', value: LOGO_URL },
      { name: 'NEXT_PUBLIC_NETWORK_LOGO_DARK', value: LOGO_URL },
      { name: 'NEXT_PUBLIC_NETWORK_ICON', value: ICON_URL },
      { name: 'NEXT_PUBLIC_NETWORK_ICON_DARK', value: ICON_URL },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ]) as any,
  });

  extendedTest('-@default +@dark-mode +@dark-mode-xl', async({ mount, page }) => {
    await page.route(LOGO_URL, (route) => {
      return route.fulfill({
        status: 200,
        path: './playwright/giant_duck_long.jpg',
      });
    });
    await page.route(ICON_URL, (route) => {
      return route.fulfill({
        status: 200,
        path: './playwright/image_s.jpg',
      });
    });

    const component = await mount(
      <TestApp>
        <NetworkLogo/>
      </TestApp>,
    );

    await expect(component.locator('a')).toHaveScreenshot();
  });
});
