import type { Locator } from '@playwright/test';
import React from 'react';

import type { StorageState } from 'playwright/fixtures/storageState';
import * as storageState from 'playwright/fixtures/storageState';
import { test as base, expect } from 'playwright/lib';
import * as configs from 'playwright/utils/configs';

import NetworkLogo from './NetworkLogo';

const LOGO_URL = 'https://localhost:3000/my-logo.png';
const ICON_URL = 'https://localhost:3000/my-icon.png';

const logoPlaceholderTest = base.extend<{ storageState: StorageState }>({
  storageState: storageState.fixture([
    storageState.addEnv('NEXT_PUBLIC_NETWORK_LOGO', ''),
    storageState.addEnv('NEXT_PUBLIC_NETWORK_ICON', ''),
  ]),
});

logoPlaceholderTest.describe('placeholder logo', () => {

  logoPlaceholderTest('+@dark-mode', async({ render }) => {
    const component = await render(<NetworkLogo/>);

    await expect(component.locator('a')).toHaveScreenshot();
  });

  logoPlaceholderTest.describe('screen xl', () => {
    logoPlaceholderTest.use({ viewport: configs.viewport.xl });

    logoPlaceholderTest('+@dark-mode', async({ render }) => {
      const component = await render(<NetworkLogo/>);

      await expect(component.locator('a')).toHaveScreenshot();
    });
  });
});

const customLogoTest = base.extend<{ storageState: StorageState }>({
  storageState: storageState.fixture([
    storageState.addEnv('NEXT_PUBLIC_NETWORK_LOGO', LOGO_URL),
    storageState.addEnv('NEXT_PUBLIC_NETWORK_ICON', ICON_URL),
  ]),
});

customLogoTest.describe('custom logo', () => {
  let component: Locator;

  customLogoTest.beforeEach(async({ render, mockConfigResponse }) => {
    await mockConfigResponse('NEXT_PUBLIC_NETWORK_LOGO', LOGO_URL, './playwright/mocks/network-logo.svg', true);
    await mockConfigResponse('NEXT_PUBLIC_NETWORK_ICON', ICON_URL, './playwright/mocks/image_svg.svg', true);
    component = await render(<NetworkLogo/>);
  });

  customLogoTest('+@dark-mode', async() => {
    await expect(component.locator('a')).toHaveScreenshot();
  });

  customLogoTest.describe('screen xl', () => {
    customLogoTest.use({ viewport: configs.viewport.xl });

    customLogoTest('+@dark-mode', async() => {
      await expect(component.locator('a')).toHaveScreenshot();
    });
  });
});

const customLogoDarkTest = base.extend<{ storageState: StorageState }>({
  storageState: storageState.fixture([
    storageState.addEnv('NEXT_PUBLIC_NETWORK_LOGO', LOGO_URL),
    storageState.addEnv('NEXT_PUBLIC_NETWORK_LOGO_DARK', LOGO_URL),
    storageState.addEnv('NEXT_PUBLIC_NETWORK_ICON', ICON_URL),
    storageState.addEnv('NEXT_PUBLIC_NETWORK_ICON_DARK', ICON_URL),
  ]),
});

customLogoDarkTest.describe('custom logo with dark option -@default +@dark-mode', () => {
  let component: Locator;

  customLogoDarkTest.beforeEach(async({ render, mockConfigResponse }) => {
    await mockConfigResponse('NEXT_PUBLIC_NETWORK_LOGO', LOGO_URL, './playwright/mocks/image_long.jpg', true);
    await mockConfigResponse('NEXT_PUBLIC_NETWORK_LOGO_DARK', LOGO_URL, './playwright/mocks/image_long.jpg', true);
    await mockConfigResponse('NEXT_PUBLIC_NETWORK_ICON', ICON_URL, './playwright/mocks/image_s.jpg', true);
    await mockConfigResponse('NEXT_PUBLIC_NETWORK_ICON_DARK', ICON_URL, './playwright/mocks/image_s.jpg', true);

    component = await render(<NetworkLogo/>);
  });

  customLogoDarkTest('', async() => {
    await expect(component.locator('a')).toHaveScreenshot();
  });

  customLogoDarkTest.describe('screen xl', () => {
    customLogoDarkTest.use({ viewport: configs.viewport.xl });

    customLogoDarkTest('', async() => {
      await expect(component.locator('a')).toHaveScreenshot();
    });
  });
});
