import { Box } from '@chakra-ui/react';
import React from 'react';

import * as tokenMock from 'mocks/tokens/tokenInfo';
import { test, expect } from 'playwright/lib';

import TokenEntity from './TokenEntity';

const variants = [ 'subheading', 'content' ] as const;

test.use({ viewport: { width: 300, height: 100 } });

test.describe('variant', () => {
  variants.forEach((variant) => {
    test(`${ variant }`, async({ render }) => {
      const component = await render(
        <TokenEntity
          token={ tokenMock.tokenInfo }
          variant={ variant }
        />,
      );

      await expect(component).toHaveScreenshot();
    });
  });
});

test('with logo, long name and symbol', async({ page, render }) => {
  const LOGO_URL = 'https://example.com/logo.png';
  await page.route(LOGO_URL, (route) => {
    return route.fulfill({
      status: 200,
      path: './playwright/mocks/image_s.jpg',
    });
  });

  await render(
    <TokenEntity
      token={{
        type: 'ERC-20',
        name: 'This token is the best token ever',
        symbol: 'DUCK DUCK DUCK',
        address_hash: tokenMock.tokenInfo.address_hash,
        icon_url: LOGO_URL,
      }}
    />,
  );

  await page.getByText(/this/i).hover();
  await expect(page).toHaveScreenshot();

  await page.getByText(/duc/i).hover();
  await expect(page).toHaveScreenshot();
});

test('loading', async({ render }) => {
  const component = await render(
    <TokenEntity
      token={ tokenMock.tokenInfo }
      isLoading
    />,
  );

  await expect(component).toHaveScreenshot();
});

test('customization', async({ render }) => {
  const component = await render(
    <Box
      borderWidth="1px"
      borderColor="orange.500"
    >
      <TokenEntity
        token={ tokenMock.tokenInfo }
        p={ 2 }
        maxW="200px"
        borderWidth="1px"
        borderColor="blue.700"
      />
    </Box>,
  );

  await expect(component).toHaveScreenshot();
});
