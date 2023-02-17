import { Box, Flex } from '@chakra-ui/react';
import { test, expect } from '@playwright/experimental-ct-react';
import React from 'react';

import * as cookies from 'lib/cookies';
import authFixture from 'playwright/fixtures/auth';
import TestApp from 'playwright/TestApp';

import NavigationDesktop from './NavigationDesktop';

const hooksConfig = {
  router: {
    route: '/blocks',
    query: { id: '0xd789a607CEac2f0E14867de4EB15b15C9FFB5859' },
    pathname: '/blocks',
  },
};

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

test.describe('auth', () => {
  const extendedTest = test.extend({
    context: ({ context }, use) => {
      authFixture(context);
      use(context);
    },
  });

  extendedTest('+@desktop-xl +@dark-mode-xl', async({ mount }) => {
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

test.describe('cookie set to false', () => {
  const extendedTest = test.extend({
    context: ({ context }, use) => {
      context.addCookies([ { name: cookies.NAMES.NAV_BAR_COLLAPSED, value: 'false', domain: 'localhost', path: '/' } ]);
      use(context);
    },
  });

  extendedTest('navbar is opened +@desktop-xl', async({ mount }) => {
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

test.describe('cookie set to true', () => {
  const extendedTest = test.extend({
    context: ({ context }, use) => {
      context.addCookies([ { name: cookies.NAMES.NAV_BAR_COLLAPSED, value: 'true', domain: 'localhost', path: '/' } ]);
      use(context);
    },
  });

  extendedTest('navbar is collapsed', async({ mount }) => {
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
