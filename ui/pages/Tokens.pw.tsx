import { Box } from '@chakra-ui/react';
import React from 'react';

import * as tokens from 'mocks/tokens/tokenInfo';
import { ENVS_MAP } from 'playwright/fixtures/mockEnvs';
import { test, expect } from 'playwright/lib';

import Tokens from './Tokens';

test.beforeEach(async({ mockTextAd }) => {
  await mockTextAd();
});

test('base view +@mobile +@dark-mode', async({ render, mockApiResponse }) => {
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
      market_cap: '0',
    },
  };
  const filteredTokens = {
    items: [
      tokens.tokenInfoERC20a, tokens.tokenInfoERC20b, tokens.tokenInfoERC20c,
    ],
    next_page_params: null,
  };

  await mockApiResponse('tokens', allTokens);
  await mockApiResponse('tokens', filteredTokens, { queryParams: { q: 'foo' } });

  const component = await render(
    <div>
      <Box h={{ base: '134px', lg: 6 }}/>
      <Tokens/>
    </div>,
  );

  await expect(component).toHaveScreenshot();

  await component.getByRole('textbox', { name: 'Token name or symbol' }).focus();
  await component.getByRole('textbox', { name: 'Token name or symbol' }).fill('foo');

  await expect(component).toHaveScreenshot();
});

test.describe('bridged tokens', () => {
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
      market_cap: null,
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

  test('base view', async({ render, page, mockApiResponse, mockEnvs }) => {
    await mockEnvs(ENVS_MAP.bridgedTokens);
    await mockApiResponse('tokens_bridged', bridgedTokens);
    await mockApiResponse('tokens_bridged', bridgedFilteredTokens, { queryParams: { chain_ids: '99' } });

    const component = await render(
      <div>
        <Box h={{ base: '134px', lg: 6 }}/>
        <Tokens/>
      </div>,
      { hooksConfig },
    );

    await expect(component).toHaveScreenshot();

    await component.getByRole('button', { name: /filter/i }).click();
    await component.locator('label').filter({ hasText: /poa/i }).click();
    await page.click('body');

    await expect(component).toHaveScreenshot();
  });
});
