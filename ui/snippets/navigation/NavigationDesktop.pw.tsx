import { Box, Flex } from '@chakra-ui/react';
import type { Locator } from '@playwright/test';
import React from 'react';

import * as cookies from 'lib/cookies';
import type { StorageState } from 'playwright/fixtures/storageState';
import * as storageState from 'playwright/fixtures/storageState';
import { test as base, expect } from 'playwright/lib';
import * as configs from 'playwright/utils/configs';

import NavigationDesktop from './NavigationDesktop';

const hooksConfig = {
  router: {
    route: '/blocks',
    query: { id: '0xd789a607CEac2f0E14867de4EB15b15C9FFB5859' },
    pathname: '/blocks',
  },
};

const FEATURED_NETWORKS_URL = 'https://localhost:3000/featured-networks.json';

const test = base.extend<{ storageState: StorageState }>({
  storageState: storageState.fixture([
    storageState.addEnv('NEXT_PUBLIC_FEATURED_NETWORKS', FEATURED_NETWORKS_URL),
  ]),
});

test.describe('no auth', () => {
  let component: Locator;

  test.beforeEach(async({ render }) => {
    component = await render(
      <Flex w="100%" minH="100vh" alignItems="stretch">
        <NavigationDesktop/>
        <Box bgColor="lightpink" w="100%"/>
      </Flex>,
      { hooksConfig },
    );
  });

  test('+@dark-mode', async() => {
    await expect(component).toHaveScreenshot();
  });

  test.describe('xl screen', () => {
    test.use({ viewport: configs.viewport.xl });

    test('+@dark-mode', async() => {
      await expect(component).toHaveScreenshot();
    });
  });
});

const authTest = base.extend<{ storageState: StorageState }>({
  storageState: storageState.fixture([
    ...storageState.COOKIES.auth,
    storageState.addEnv('NEXT_PUBLIC_FEATURED_NETWORKS', FEATURED_NETWORKS_URL),
  ]),
});

authTest.describe('auth', () => {
  let component: Locator;

  authTest.beforeEach(async({ render }) => {
    component = await render(
      <Flex w="100%" minH="100vh" alignItems="stretch">
        <NavigationDesktop/>
        <Box bgColor="lightpink" w="100%"/>
      </Flex>,
      { hooksConfig },
    );
  });

  authTest('+@dark-mode', async() => {
    await expect(component).toHaveScreenshot();
  });

  authTest.describe('xl screen', () => {
    authTest.use({ viewport: configs.viewport.xl });

    authTest('+@dark-mode', async() => {
      await expect(component).toHaveScreenshot();
    });
  });
});

test.describe('with tooltips', () => {
  test.use({ viewport: configs.viewport.xl });

  test('', async({ render, page }) => {
    const component = await render(
      <Flex w="100%" minH="100vh" alignItems="stretch">
        <NavigationDesktop/>
        <Box bgColor="lightpink" w="100%"/>
      </Flex>,
      { hooksConfig },
    );

    await component.locator('header').hover();
    await page.locator('div[aria-label="Expand/Collapse menu"]').click();
    await page.locator('a[aria-label="Tokens link"]').hover();

    await expect(component).toHaveScreenshot();
  });
});

test.describe('with submenu', () => {
  let component: Locator;

  test.beforeEach(async({ render, page }) => {
    component = await render(
      <Flex w="100%" minH="100vh" alignItems="stretch">
        <NavigationDesktop/>
        <Box bgColor="lightpink" w="100%"/>
      </Flex>,
      { hooksConfig },
    );
    await page.locator('a[aria-label="Blockchain link group"]').hover();
  });

  test('', async() => {
    await expect(component).toHaveScreenshot();
  });

  test.describe('xl screen', () => {
    test.use({ viewport: configs.viewport.xl });

    test('', async() => {
      await expect(component).toHaveScreenshot();
    });
  });
});

const noSideBarCookieTest = base.extend<{ storageState: StorageState }>({
  storageState: storageState.fixture([
    storageState.addEnv('NEXT_PUBLIC_FEATURED_NETWORKS', FEATURED_NETWORKS_URL),
    storageState.addCookie(cookies.NAMES.NAV_BAR_COLLAPSED, 'false'),
  ]),
});

noSideBarCookieTest.describe('cookie set to false', () => {
  let component: Locator;

  noSideBarCookieTest.beforeEach(async({ render }) => {
    component = await render(
      <Flex w="100%" minH="100vh" alignItems="stretch">
        <NavigationDesktop/>
        <Box bgColor="lightpink" w="100%"/>
      </Flex>,
      { hooksConfig },
    );
  });

  noSideBarCookieTest('', async() => {
    const networkMenu = component.locator('button[aria-label="Network menu"]');
    await expect(networkMenu).toBeVisible();
  });

  noSideBarCookieTest.describe('xl screen', () => {
    noSideBarCookieTest.use({ viewport: configs.viewport.xl });

    noSideBarCookieTest('', async() => {
      const networkMenu = component.locator('button[aria-label="Network menu"]');
      await expect(networkMenu).toBeVisible();
    });
  });
});

const sideBarCookieTest = base.extend<{ storageState: StorageState }>({
  storageState: storageState.fixture([
    storageState.addEnv('NEXT_PUBLIC_FEATURED_NETWORKS', FEATURED_NETWORKS_URL),
    storageState.addCookie(cookies.NAMES.NAV_BAR_COLLAPSED, 'true'),
  ]),
});

sideBarCookieTest.describe('cookie set to true', () => {
  sideBarCookieTest('navbar is collapsed', async({ render }) => {
    const component = await render(
      <Flex w="100%" minH="100vh" alignItems="stretch">
        <NavigationDesktop/>
        <Box bgColor="lightpink" w="100%"/>
      </Flex>,
      { hooksConfig },
    );

    const networkMenu = component.locator('button[aria-label="Network menu"]');
    expect(await networkMenu.isVisible()).toBe(false);
  });
});

test('hover +@dark-mode', async({ render }) => {
  const component = await render(
    <Flex w="100%" minH="100vh" alignItems="stretch">
      <NavigationDesktop/>
      <Box bgColor="lightpink" w="100%"/>
    </Flex>,
    { hooksConfig },
  );

  await component.locator('header').hover();
  await expect(component).toHaveScreenshot();
});

test.describe('hover xl screen', () => {
  test.use({ viewport: configs.viewport.xl });

  test('+@dark-mode', async({ render }) => {
    const component = await render(
      <Flex w="100%" minH="100vh" alignItems="stretch">
        <NavigationDesktop/>
        <Box bgColor="lightpink" w="100%"/>
      </Flex>,
      { hooksConfig },
    );

    await component.locator('header').hover();
    await expect(component).toHaveScreenshot();
  });
});
