import type { BrowserContext } from '@playwright/test';
import React from 'react';

import * as profileMock from 'mocks/user/profile';
import { contextWithAuth } from 'playwright/fixtures/auth';
import { test as base, expect } from 'playwright/lib';

import AccountActionsMenu from './AccountActionsMenu';

const test = base.extend<{ context: BrowserContext }>({
  context: contextWithAuth,
});

test.use({ viewport: { width: 200, height: 200 } });

test.describe('with multiple items', () => {
  const hooksConfig = {
    router: {
      query: { hash: '<hash>' },
      pathname: '/token/[hash]',
      isReady: true,
    },
  };

  test.beforeEach(async({ mockApiResponse }) => {
    mockApiResponse('user_info', profileMock.base);
  });

  test('base view', async({ render, page }) => {
    const component = await render(<AccountActionsMenu/>, { hooksConfig });
    await component.getByRole('button').click();

    await expect(page).toHaveScreenshot();
  });

  test('base view with styles', async({ render, page }) => {
    const component = await render(<AccountActionsMenu m={ 2 } outline="1px solid lightpink"/>, { hooksConfig });
    await component.getByRole('button').click();

    await expect(page).toHaveScreenshot();
  });

  test('loading', async({ render }) => {
    const component = await render(<AccountActionsMenu isLoading/>, { hooksConfig });

    await expect(component).toHaveScreenshot();
  });

  test('loading with styles', async({ render }) => {
    const component = await render(<AccountActionsMenu isLoading m={ 2 } outline="1px solid lightpink"/>, { hooksConfig });

    await expect(component).toHaveScreenshot();
  });
});

test.describe('with one item', () => {
  const hooksConfig = {
    router: {
      query: { hash: '<hash>' },
      pathname: '/tx/[hash]',
      isReady: true,
    },
  };

  test('base view', async({ render, page }) => {
    const component = await render(<AccountActionsMenu/>, { hooksConfig });
    await component.getByRole('button').hover();

    await expect(page).toHaveScreenshot();
  });

  test('base view with styles', async({ render, page }) => {
    const component = await render(<AccountActionsMenu m={ 2 } outline="1px solid lightpink"/>, { hooksConfig });
    await component.getByRole('button').hover();

    await expect(page).toHaveScreenshot();
  });

  test('loading', async({ render }) => {
    const component = await render(<AccountActionsMenu isLoading/>, { hooksConfig });

    await expect(component).toHaveScreenshot();
  });
});
