import { Box } from '@chakra-ui/react';
import { test as base, expect } from '@playwright/experimental-ct-react';
import React from 'react';

import * as textAdMock from 'mocks/ad/textAd';
import * as tokens from 'mocks/tokens/tokenInfo';
import contextWithEnvs from 'playwright/fixtures/contextWithEnvs';
import TestApp from 'playwright/TestApp';
import buildApiUrl from 'playwright/utils/buildApiUrl';
import * as configs from 'playwright/utils/configs';

import Tokens from './Tokens';

base.beforeEach(async({ page }) => {
  await page.route('https://request-global.czilladx.com/serve/native.php?z=19260bf627546ab7242', (route) => route.fulfill({
    status: 200,
    body: JSON.stringify(textAdMock.duck),
  }));
  await page.route(textAdMock.duck.ad.thumbnail, (route) => {
    return route.fulfill({
      status: 200,
      path: './playwright/mocks/image_s.jpg',
    });
  });
});

base('base view +@mobile +@dark-mode', async({ mount, page }) => {
  const allTokens = {
    items: [
      tokens.tokenInfoERC20a, tokens.tokenInfoERC20b, tokens.tokenInfoERC20c, tokens.tokenInfoERC20d,
      tokens.tokenInfoERC721a, tokens.tokenInfoERC721b, tokens.tokenInfoERC721c,
      tokens.tokenInfoERC1155a, tokens.tokenInfoERC1155b, tokens.tokenInfoERC1155WithoutName,
    ],
    next_page_params: {
      holder_count: 1,
      items_count: 1,
      name: 'a',
    },
  };
  const filteredTokens = {
    items: [
      tokens.tokenInfoERC20a, tokens.tokenInfoERC20b, tokens.tokenInfoERC20c,
    ],
    next_page_params: null,
  };

  const ALL_TOKENS_API_URL = buildApiUrl('tokens');
  const FILTERED_TOKENS_API_URL = buildApiUrl('tokens') + '?q=foo';

  await page.route(ALL_TOKENS_API_URL, (route) => route.fulfill({
    status: 200,
    body: JSON.stringify(allTokens),
  }));

  await page.route(FILTERED_TOKENS_API_URL, (route) => route.fulfill({
    status: 200,
    body: JSON.stringify(filteredTokens),
  }));

  const component = await mount(
    <TestApp>
      <Box h={{ base: '134px', lg: 6 }}/>
      <Tokens/>
    </TestApp>,
  );

  await expect(component).toHaveScreenshot();

  await component.getByRole('textbox', { name: 'Token name or symbol' }).focus();
  await component.getByRole('textbox', { name: 'Token name or symbol' }).type('foo');

  await expect(component).toHaveScreenshot();
});

base.describe('bridged tokens', async() => {
  const test = base.extend({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    context: contextWithEnvs(configs.featureEnvs.bridgedTokens) as any,
  });

  const bridgedTokens = {
    items: [
      tokens.bridgedTokenA,
      tokens.bridgedTokenB,
      tokens.bridgedTokenC,
    ],
    next_page_params: {
      holder_count: 1,
      items_count: 1,
      name: 'a',
    },
  };
  const bridgedFilteredTokens = {
    items: [
      tokens.bridgedTokenC,
    ],
    next_page_params: null,
  };
  const hooksConfig = {
    router: {
      query: { tab: 'bridged' },
    },
  };
  const BRIDGED_TOKENS_API_URL = buildApiUrl('tokens_bridged');

  test.beforeEach(async({ page }) => {
    await page.route(BRIDGED_TOKENS_API_URL, (route) => route.fulfill({
      status: 200,
      body: JSON.stringify(bridgedTokens),
    }));
  });

  test('base view', async({ mount, page }) => {
    await page.route(BRIDGED_TOKENS_API_URL + '?chain_ids=99', (route) => route.fulfill({
      status: 200,
      body: JSON.stringify(bridgedFilteredTokens),
    }));

    const component = await mount(
      <TestApp>
        <Box h={{ base: '134px', lg: 6 }}/>
        <Tokens/>
      </TestApp>,
      { hooksConfig },
    );

    await expect(component).toHaveScreenshot();

    await component.getByRole('button', { name: /filter/i }).click();
    await component.locator('label').filter({ hasText: /poa/i }).click();
    await page.click('body');

    await expect(component).toHaveScreenshot();
  });
});
