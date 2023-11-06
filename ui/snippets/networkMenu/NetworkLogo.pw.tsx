import { test as base, expect } from '@playwright/experimental-ct-react';
import type { Locator } from '@playwright/test';
import React from 'react';

import { buildExternalAssetFilePath } from 'configs/app/utils';
import contextWithEnvs from 'playwright/fixtures/contextWithEnvs';
import TestApp from 'playwright/TestApp';
import * as app from 'playwright/utils/app';
import * as configs from 'playwright/utils/configs';

import NetworkLogo from './NetworkLogo';

base.describe('placeholder logo', () => {
  const test = base.extend({
    context: contextWithEnvs([
      { name: 'NEXT_PUBLIC_NETWORK_LOGO', value: '' },
      { name: 'NEXT_PUBLIC_NETWORK_ICON', value: '' },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ]) as any,
  });

  test('+@dark-mode', async({ mount }) => {
    const component = await mount(
      <TestApp>
        <NetworkLogo/>
      </TestApp>,
    );

    await expect(component.locator('a')).toHaveScreenshot();
  });

  test.describe('screen xl', () => {
    test.use({ viewport: configs.viewport.xl });

    test('+@dark-mode', async({ mount }) => {
      const component = await mount(
        <TestApp>
          <NetworkLogo/>
        </TestApp>,
      );

      await expect(component.locator('a')).toHaveScreenshot();
    });
  });
});

base.describe('custom logo', () => {
  const LOGO_URL = app.url + buildExternalAssetFilePath('NEXT_PUBLIC_NETWORK_LOGO', 'https://localhost:3000/my-logo.png') || '';
  const ICON_URL = app.url + buildExternalAssetFilePath('NEXT_PUBLIC_NETWORK_ICON', 'https://localhost:3000/my-icon.png') || '';
  const test = base.extend({
    context: contextWithEnvs([
      { name: 'NEXT_PUBLIC_NETWORK_LOGO', value: LOGO_URL },
      { name: 'NEXT_PUBLIC_NETWORK_ICON', value: ICON_URL },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ]) as any,
  });

  let component: Locator;

  test.beforeEach(async({ page, mount }) => {
    await page.route(LOGO_URL, (route) => {
      return route.fulfill({
        status: 200,
        path: './playwright/mocks/network-logo.svg',
      });
    });
    await page.route(ICON_URL, (route) => {
      return route.fulfill({
        status: 200,
        path: './playwright/mocks/image_svg.svg',
      });
    });

    component = await mount(
      <TestApp>
        <NetworkLogo/>
      </TestApp>,
    );
  });

  test('+@dark-mode', async() => {
    await expect(component.locator('a')).toHaveScreenshot();
  });

  test.describe('screen xl', () => {
    test.use({ viewport: configs.viewport.xl });

    test('+@dark-mode', async() => {
      await expect(component.locator('a')).toHaveScreenshot();
    });
  });
});

base.describe('custom logo with dark option -@default +@dark-mode', () => {
  const LOGO_URL = app.url + buildExternalAssetFilePath('NEXT_PUBLIC_NETWORK_LOGO', 'https://localhost:3000/my-logo.png') || '';
  const LOGO_URL_DARK = app.url + buildExternalAssetFilePath('NEXT_PUBLIC_NETWORK_LOGO_DARK', 'https://localhost:3000/my-logo.png') || '';
  const ICON_URL = app.url + buildExternalAssetFilePath('NEXT_PUBLIC_NETWORK_ICON', 'https://localhost:3000/my-icon.png') || '';
  const ICON_URL_DARK = app.url + buildExternalAssetFilePath('NEXT_PUBLIC_NETWORK_ICON_DARK', 'https://localhost:3000/my-icon.png') || '';
  const test = base.extend({
    context: contextWithEnvs([
      { name: 'NEXT_PUBLIC_NETWORK_LOGO', value: LOGO_URL },
      { name: 'NEXT_PUBLIC_NETWORK_LOGO_DARK', value: LOGO_URL_DARK },
      { name: 'NEXT_PUBLIC_NETWORK_ICON', value: ICON_URL },
      { name: 'NEXT_PUBLIC_NETWORK_ICON_DARK', value: ICON_URL_DARK },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ]) as any,
  });

  let component: Locator;

  test.beforeEach(async({ page, mount }) => {
    await page.route(LOGO_URL, (route) => {
      return route.fulfill({
        status: 200,
        path: './playwright/mocks/image_long.jpg',
      });
    });
    await page.route(LOGO_URL_DARK, (route) => {
      return route.fulfill({
        status: 200,
        path: './playwright/mocks/image_long.jpg',
      });
    });
    await page.route(ICON_URL, (route) => {
      return route.fulfill({
        status: 200,
        path: './playwright/mocks/image_s.jpg',
      });
    });
    await page.route(ICON_URL_DARK, (route) => {
      return route.fulfill({
        status: 200,
        path: './playwright/mocks/image_s.jpg',
      });
    });

    component = await mount(
      <TestApp>
        <NetworkLogo/>
      </TestApp>,
    );
  });

  test('', async() => {
    await expect(component.locator('a')).toHaveScreenshot();
  });

  test.describe('screen xl', () => {
    test.use({ viewport: configs.viewport.xl });

    test('', async() => {
      await expect(component.locator('a')).toHaveScreenshot();
    });
  });
});
