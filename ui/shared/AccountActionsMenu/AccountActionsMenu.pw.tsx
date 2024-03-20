import { test as base, expect } from '@playwright/experimental-ct-react';
import React from 'react';

import * as profileMock from 'mocks/user/profile';
import authFixture from 'playwright/fixtures/auth';
import TestApp from 'playwright/TestApp';
import buildApiUrl from 'playwright/utils/buildApiUrl';

import AccountActionsMenu from './AccountActionsMenu';

const USER_INFO_URL = buildApiUrl('user_info');

const test = base.extend({
  context: ({ context }, use) => {
    authFixture(context);
    use(context);
  },
});

test.use({ viewport: { width: 200, height: 200 } });

test.describe('with multiple items', async() => {
  const hooksConfig = {
    router: {
      query: { hash: '<hash>' },
      pathname: '/token/[hash]',
      isReady: true,
    },
  };

  test.beforeEach(async({ page }) => {
    await page.route(USER_INFO_URL, (route) => route.fulfill({
      body: JSON.stringify(profileMock.base),
    }));
  });

  test('base view', async({ mount, page }) => {
    const component = await mount(
      <TestApp>
        <AccountActionsMenu/>
      </TestApp>,
      { hooksConfig },
    );

    await component.getByRole('button').click();

    await expect(page).toHaveScreenshot();
  });

  test('base view with styles', async({ mount, page }) => {
    const component = await mount(
      <TestApp>
        <AccountActionsMenu m={ 2 } outline="1px solid lightpink"/>
      </TestApp>,
      { hooksConfig },
    );

    await component.getByRole('button').click();

    await expect(page).toHaveScreenshot();
  });

  test('loading', async({ mount }) => {
    const component = await mount(
      <TestApp>
        <AccountActionsMenu isLoading/>
      </TestApp>,
      { hooksConfig },
    );

    await expect(component).toHaveScreenshot();
  });

  test('loading with styles', async({ mount }) => {
    const component = await mount(
      <TestApp>
        <AccountActionsMenu isLoading m={ 2 } outline="1px solid lightpink"/>
      </TestApp>,
      { hooksConfig },
    );

    await expect(component).toHaveScreenshot();
  });
});

test.describe('with one item', async() => {
  const hooksConfig = {
    router: {
      query: { hash: '<hash>' },
      pathname: '/tx/[hash]',
      isReady: true,
    },
  };

  test('base view', async({ mount, page }) => {
    const component = await mount(
      <TestApp>
        <AccountActionsMenu/>
      </TestApp>,
      { hooksConfig },
    );

    await component.getByRole('button').hover();

    await expect(page).toHaveScreenshot();
  });

  test('base view with styles', async({ mount, page }) => {
    const component = await mount(
      <TestApp>
        <AccountActionsMenu m={ 2 } outline="1px solid lightpink"/>
      </TestApp>,
      { hooksConfig },
    );

    await component.getByRole('button').hover();

    await expect(page).toHaveScreenshot();
  });

  test('loading', async({ mount }) => {
    const component = await mount(
      <TestApp>
        <AccountActionsMenu isLoading/>
      </TestApp>,
      { hooksConfig },
    );

    await expect(component).toHaveScreenshot();
  });
});
