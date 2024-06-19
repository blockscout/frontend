import { Box, Flex } from '@chakra-ui/react';
import type { BrowserContext, Locator } from '@playwright/test';
import React from 'react';

import config from 'configs/app';
import * as cookies from 'lib/cookies';
import { FEATURED_NETWORKS_MOCK } from 'mocks/config/network';
import { contextWithAuth } from 'playwright/fixtures/auth';
import { ENVS_MAP } from 'playwright/fixtures/mockEnvs';
import { test, expect } from 'playwright/lib';
import * as pwConfig from 'playwright/utils/config';

import NavigationDesktop from './NavigationDesktop';

const hooksConfig = {
  router: {
    route: '/blocks',
    query: { id: '0xd789a607CEac2f0E14867de4EB15b15C9FFB5859' },
    pathname: '/blocks',
  },
};

const FEATURED_NETWORKS_URL = 'https://localhost:3000/featured-networks.json';

test.beforeEach(async({ mockEnvs, mockConfigResponse }) => {
  await mockEnvs([
    [ 'NEXT_PUBLIC_FEATURED_NETWORKS', FEATURED_NETWORKS_URL ],
  ]);
  await mockConfigResponse('NEXT_PUBLIC_FEATURED_NETWORKS', FEATURED_NETWORKS_URL, FEATURED_NETWORKS_MOCK);
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
    test.use({ viewport: pwConfig.viewport.xl });

    test('+@dark-mode', async() => {
      await expect(component).toHaveScreenshot();
    });
  });
});

const authTest = test.extend<{ context: BrowserContext }>({
  context: contextWithAuth,
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
    authTest.use({ viewport: pwConfig.viewport.xl });

    authTest('+@dark-mode', async() => {
      await expect(component).toHaveScreenshot();
    });
  });
});

test.describe('with tooltips', () => {
  test.use({ viewport: pwConfig.viewport.xl });

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
    test.use({ viewport: pwConfig.viewport.xl });

    test('', async() => {
      await expect(component).toHaveScreenshot();
    });
  });
});

const noSideBarCookieTest = test.extend({
  context: ({ context }, use) => {
    context.addCookies([ { name: cookies.NAMES.NAV_BAR_COLLAPSED, value: 'false', domain: config.app.host, path: '/' } ]);
    use(context);
  },
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
    noSideBarCookieTest.use({ viewport: pwConfig.viewport.xl });

    noSideBarCookieTest('', async() => {
      const networkMenu = component.locator('button[aria-label="Network menu"]');
      await expect(networkMenu).toBeVisible();
    });
  });
});

const sideBarCookieTest = test.extend({
  context: ({ context }, use) => {
    context.addCookies([ { name: cookies.NAMES.NAV_BAR_COLLAPSED, value: 'true', domain: config.app.host, path: '/' } ]);
    use(context);
  },
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
  test.use({ viewport: pwConfig.viewport.xl });

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

test.describe('with highlighted routes', () => {
  let component: Locator;

  test.beforeEach(async({ render, mockEnvs }) => {
    await mockEnvs(ENVS_MAP.navigationHighlightedRoutes);

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

  test('with submenu', async({ page }) => {
    await page.locator('a[aria-label="Blockchain link group"]').hover();
    await expect(component).toHaveScreenshot();
  });

  test.describe('xl screen', () => {
    test.use({ viewport: pwConfig.viewport.xl });

    test('+@dark-mode', async() => {
      await expect(component).toHaveScreenshot();
    });
  });
});
