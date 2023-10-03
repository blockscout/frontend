import { Box } from '@chakra-ui/react';
import { test, expect } from '@playwright/experimental-ct-react';
import React from 'react';

import * as tokens from 'mocks/tokens/tokenInfo';
import TestApp from 'playwright/TestApp';
import buildApiUrl from 'playwright/utils/buildApiUrl';
import type { QueryWithPagesResult } from 'ui/shared/pagination/useQueryWithPages';

import Tokens from './Tokens';

const API_URL_TOKENS = buildApiUrl('tokens');

const tokensResponse = {
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

test('base view +@mobile +@dark-mode', async({ mount, page }) => {
  await page.route(API_URL_TOKENS, (route) => route.fulfill({
    status: 200,
    body: JSON.stringify(tokensResponse),
  }));

  const component = await mount(
    <TestApp>
      <Box h={{ base: '134px', lg: 6 }}/>
      <Tokens
        query={{ items: [], next_page_params: null } as unknown as QueryWithPagesResult<'tokens'> | QueryWithPagesResult<'tokens_bridged'>}
        // eslint-disable-next-line react/jsx-no-bind
        onSortChange={ () => {} }
        sort={ undefined }
        hasActiveFilters={ false }/>
    </TestApp>,
  );

  await expect(component).toHaveScreenshot();
});
