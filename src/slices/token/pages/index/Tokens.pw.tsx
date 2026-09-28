import { Box } from '@chakra-ui/react';

import * as tokens from 'src/slices/token/mocks/info';

import { ENVS_MAP } from 'playwright/fixtures/mockEnvs';
import { expect, test } from 'playwright/lib';

import Tokens from './Tokens';

test.beforeEach(async({ mockTextAd, mockAssetResponse }) => {
  await mockTextAd();
  await mockAssetResponse(tokens.tokenInfoERC20a.icon_url as string, './playwright/mocks/image_svg.svg');
});

const allTokens = {
  items: [
    tokens.tokenInfoERC20a, tokens.tokenInfoERC20b, tokens.tokenInfoERC20c, tokens.tokenInfoERC20d,
    tokens.tokenInfoERC721a, tokens.tokenInfoERC721b, tokens.tokenInfoERC721c,
    tokens.tokenInfoERC1155a, tokens.tokenInfoERC1155b, tokens.tokenInfoERC1155WithoutName,
  ],
  next_page_params: {
    holders_count: 1,
    items_count: 1,
    name: 'a',
    market_cap: '0',
  },
};

// FIXME: test is flaky, screenshot in docker container is different from local
test.skip('base view +@dark-mode', async({ render, mockApiResponse }) => {

  await mockApiResponse('core:tokens', allTokens);

  const component = await render(
    <div>
      <Box h={{ base: '134px', lg: 6 }}/>
      <Tokens/>
    </div>,
  );

  await expect(component).toHaveScreenshot();
});

test('with search +@dark-mode', async({ page, render, mockApiResponse }) => {
  const filteredTokens = {
    items: [
      tokens.tokenInfoERC20a, tokens.tokenInfoERC20b, tokens.tokenInfoERC20c,
    ],
    next_page_params: null,
  };

  const hooksConfig = {
    router: {
      query: { q: 'foo' },
    },
  };

  const filteredTokensApiUrl = await mockApiResponse('core:tokens', filteredTokens, { queryParams: { q: 'foo' } });

  const component = await render(
    <div>
      <Box h={{ base: '134px', lg: 6 }}/>
      <Tokens/>
    </div>,
    { hooksConfig },
  );

  await page.waitForResponse(filteredTokensApiUrl);
  await expect(component).toHaveScreenshot({ maxDiffPixels: 20 });
});

test.describe('bridged tokens', () => {
  const bridgedTokens = {
    items: [
      tokens.bridgedTokenA,
      tokens.bridgedTokenB,
      tokens.bridgedTokenC,
    ],
    next_page_params: {
      holders_count: 1,
      items_count: 1,
      name: 'a',
      market_cap: null,
    },
  };
  const hooksConfig = {
    router: {
      query: { tab: 'bridged' },
    },
  };

  test('base view', async({ render, mockApiResponse, mockEnvs }) => {
    await mockEnvs(ENVS_MAP.bridgedTokens);
    await mockApiResponse('core:tokens_bridged', bridgedTokens);

    const component = await render(
      <div>
        <Box h={{ base: '134px', lg: 6 }}/>
        <Tokens/>
      </div>,
      { hooksConfig },
    );

    await expect(component).toHaveScreenshot();
  });
});
