import { Box } from '@chakra-ui/react';
import { test, expect } from '@playwright/experimental-ct-react';
import React from 'react';

import * as tokenMock from 'mocks/tokens/tokenInfo';
import TestApp from 'playwright/TestApp';

import TokenEntity from './TokenEntity';

const iconSizes = [ 'md', 'lg' ];

test.use({ viewport: { width: 300, height: 100 } });

test.describe('icon size', () => {
  iconSizes.forEach((size) => {
    test(size, async({ mount }) => {
      const component = await mount(
        <TestApp>
          <TokenEntity
            token={ tokenMock.tokenInfo }
            iconSize={ size }
          />
        </TestApp>,
      );

      await expect(component).toHaveScreenshot();
    });
  });
});

test('with logo, long name and symbol', async({ page, mount }) => {
  const LOGO_URL = 'https://example.com/logo.png';
  await page.route(LOGO_URL, (route) => {
    return route.fulfill({
      status: 200,
      path: './playwright/mocks/image_s.jpg',
    });
  });

  await mount(
    <TestApp>
      <TokenEntity
        token={{
          name: 'This token is the best token ever',
          symbol: 'DUCK DUCK DUCK',
          address: tokenMock.tokenInfo.address,
          icon_url: LOGO_URL,
        }}
      />
    </TestApp>,
  );

  await page.getByText(/this/i).hover();
  await expect(page).toHaveScreenshot();

  await page.getByText(/duc/i).hover();
  await expect(page).toHaveScreenshot();
});

test('loading', async({ mount }) => {
  const component = await mount(
    <TestApp>
      <TokenEntity
        token={ tokenMock.tokenInfo }
        isLoading
      />
    </TestApp>,
  );

  await expect(component).toHaveScreenshot();
});

test('customization', async({ mount }) => {
  const component = await mount(
    <TestApp>
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
      </Box>
    </TestApp>,
  );

  await expect(component).toHaveScreenshot();
});
