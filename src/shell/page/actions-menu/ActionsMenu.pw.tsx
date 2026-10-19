import type { BrowserContext } from '@playwright/test';
import React from 'react';

import * as profileMock from 'src/features/account/mocks/user-profile';
import * as verifiedAddressesMock from 'src/features/account/mocks/verified-addresses';

import config from 'src/config';

import { contextWithAuth } from 'playwright/fixtures/auth';
import { test as base, expect } from 'playwright/lib';

import ActionsMenu from './ActionsMenu';

const HASH = '<hash>';

const test = base.extend<{ context: BrowserContext }>({
  context: contextWithAuth,
});

test.beforeEach(async({ mockApiResponse }) => {
  await mockApiResponse('core:user_info', profileMock.base);
});

test.describe('with multiple items', () => {
  const hooksConfig = {
    router: {
      query: { hash: HASH },
      pathname: '/token/[hash]',
      isReady: true,
    },
  };

  test.beforeEach(async({ mockApiResponse }) => {
    await mockApiResponse(
      'contractInfo:verified_addresses',
      verifiedAddressesMock.VERIFIED_ADDRESS_RESPONSE.DEFAULT,
      { pathParams: { instanceId: config.apis.contractInfo?.instanceId } },
    );
    await mockApiResponse(
      'admin:token_info_applications',
      verifiedAddressesMock.TOKEN_INFO_APPLICATIONS_RESPONSE.DEFAULT,
      { pathParams: { instanceId: config.apis.admin?.instanceId, id: undefined } },
    );
    await mockApiResponse(
      'contractInfo:token_verified_info',
      verifiedAddressesMock.TOKEN_INFO,
      { pathParams: { instanceId: config.apis.contractInfo?.instanceId, hash: HASH } },
    );
  });

  test('base view', async({ render, page }) => {
    const component = await render(<ActionsMenu/>, { hooksConfig });
    await component.getByRole('button').click();

    await expect(page).toHaveScreenshot({ clip: { x: 0, y: 0, width: 200, height: 200 } });
  });

  test('base view with styles', async({ render, page }) => {
    const component = await render(<ActionsMenu m={ 2 } outline="1px solid lightpink"/>, { hooksConfig });
    await component.getByRole('button').click();

    await expect(page).toHaveScreenshot({ clip: { x: 0, y: 0, width: 200, height: 200 } });
  });

  test('loading', async({ render }) => {
    const component = await render(<ActionsMenu isLoading/>, { hooksConfig });

    await expect(component).toHaveScreenshot();
  });

  test('loading with styles', async({ render }) => {
    const component = await render(<ActionsMenu isLoading m={ 2 } outline="1px solid lightpink"/>, { hooksConfig });

    await expect(component).toHaveScreenshot();
  });
});

test.describe('with one item', () => {
  const hooksConfig = {
    router: {
      query: { hash: HASH },
      pathname: '/tx/[hash]',
      isReady: true,
    },
  };

  test('base view', async({ render, page }) => {
    const component = await render(<ActionsMenu/>, { hooksConfig });
    await component.getByRole('button').hover();
    await expect(page.getByText('Add private tag')).toBeVisible();
    await expect(page).toHaveScreenshot({ clip: { x: 0, y: 0, width: 200, height: 200 } });
  });

  test('base view with styles', async({ render, page }) => {
    const component = await render(<ActionsMenu m={ 2 } outline="1px solid lightpink"/>, { hooksConfig });
    await component.getByRole('button').hover();
    await expect(page.getByText('Add private tag')).toBeVisible();
    await expect(page).toHaveScreenshot({ clip: { x: 0, y: 0, width: 200, height: 200 } });
  });

  test('loading', async({ render }) => {
    const component = await render(<ActionsMenu isLoading/>, { hooksConfig });

    await expect(component).toHaveScreenshot();
  });
});
