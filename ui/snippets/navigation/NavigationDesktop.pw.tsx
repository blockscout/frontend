import { Box, Flex } from '@chakra-ui/react';
import { test as base, expect } from '@playwright/experimental-ct-react';
import React from 'react';

import * as cookies from 'lib/cookies';
import authFixture from 'playwright/fixtures/auth';
import contextWithEnvs, { createContextWithEnvs } from 'playwright/fixtures/contextWithEnvs';
import TestApp from 'playwright/TestApp';

import NavigationDesktop from './NavigationDesktop';

const hooksConfig = {
  router: {
    route: '/blocks',
    query: { id: '0xd789a607CEac2f0E14867de4EB15b15C9FFB5859' },
    pathname: '/blocks',
  },
};

const FEATURED_NETWORKS_URL = 'https://localhost:3000/featured-networks.json';

const test = base.extend({
  context: contextWithEnvs([
    { name: 'NEXT_PUBLIC_FEATURED_NETWORKS', value: FEATURED_NETWORKS_URL },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ]) as any,
});

test('no auth +@desktop-xl +@dark-mode-xl', async({ mount }) => {
  const component = await mount(
    <TestApp>
      <Flex w="100%" minH="100vh" alignItems="stretch">
        <NavigationDesktop/>
        <Box bgColor="lightpink" w="100%"/>
      </Flex>
    </TestApp>,
    { hooksConfig },
  );

  await expect(component).toHaveScreenshot();
});

base.describe('auth', () => {
  const test = base.extend({
    context: async({ browser }, use) => {
      const context = await createContextWithEnvs(browser, [
        { name: 'NEXT_PUBLIC_FEATURED_NETWORKS', value: FEATURED_NETWORKS_URL },
      ]);
      authFixture(context);
      use(context);
    },
  });

  test('+@desktop-xl +@dark-mode-xl', async({ mount }) => {
    const component = await mount(
      <TestApp>
        <Flex w="100%" minH="100vh" alignItems="stretch">
          <NavigationDesktop/>
          <Box bgColor="lightpink" w="100%"/>
        </Flex>
      </TestApp>,
      { hooksConfig },
    );

    await expect(component).toHaveScreenshot();
  });
});

test('with tooltips +@desktop-xl -@default', async({ mount, page }) => {
  const component = await mount(
    <TestApp>
      <Flex w="100%" minH="100vh" alignItems="stretch">
        <NavigationDesktop/>
        <Box bgColor="lightpink" w="100%"/>
      </Flex>
    </TestApp>,
    { hooksConfig },
  );

  await page.locator('svg[aria-label="Expand/Collapse menu"]').click();
  await page.locator('a[aria-label="Tokens link"]').hover();

  await expect(component).toHaveScreenshot();
});

test('with submenu +@desktop-xl +@dark-mode', async({ mount, page }) => {
  const component = await mount(
    <TestApp>
      <Flex w="100%" minH="100vh" alignItems="stretch">
        <NavigationDesktop/>
        <Box bgColor="lightpink" w="100%"/>
      </Flex>
    </TestApp>,
    { hooksConfig },
  );
  await page.locator('a[aria-label="Blockchain link group"]').hover();

  await expect(component).toHaveScreenshot();
});

base.describe('cookie set to false', () => {
  const test = base.extend({
    context: async({ browser }, use) => {
      const context = await createContextWithEnvs(browser, [
        { name: 'NEXT_PUBLIC_FEATURED_NETWORKS', value: FEATURED_NETWORKS_URL },
      ]);
      context.addCookies([ { name: cookies.NAMES.NAV_BAR_COLLAPSED, value: 'false', domain: 'localhost', path: '/' } ]);
      use(context);
    },
  });

  test('navbar is opened +@desktop-xl', async({ mount }) => {
    const component = await mount(
      <TestApp>
        <Flex w="100%" minH="100vh" alignItems="stretch">
          <NavigationDesktop/>
          <Box bgColor="lightpink" w="100%"/>
        </Flex>
      </TestApp>,
      { hooksConfig },
    );

    const networkMenu = component.locator('button[aria-label="Network menu"]');
    expect(await networkMenu.isVisible()).toBe(true);
  });
});

base.describe('cookie set to true', () => {
  const test = base.extend({
    context: async({ browser }, use) => {
      const context = await createContextWithEnvs(browser, [
        { name: 'NEXT_PUBLIC_FEATURED_NETWORKS', value: FEATURED_NETWORKS_URL },
      ]);
      context.addCookies([ { name: cookies.NAMES.NAV_BAR_COLLAPSED, value: 'true', domain: 'localhost', path: '/' } ]);
      use(context);
    },
  });

  test('navbar is collapsed', async({ mount }) => {
    const component = await mount(
      <TestApp>
        <Flex w="100%" minH="100vh" alignItems="stretch">
          <NavigationDesktop/>
          <Box bgColor="lightpink" w="100%"/>
        </Flex>
      </TestApp>,
      { hooksConfig },
    );

    const networkMenu = component.locator('button[aria-label="Network menu"]');
    expect(await networkMenu.isVisible()).toBe(false);
  });
});
