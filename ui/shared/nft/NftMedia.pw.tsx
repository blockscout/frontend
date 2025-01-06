import { Box } from '@chakra-ui/react';
import React from 'react';

import type { TokenInstance } from 'types/api/token';

import { test, expect } from 'playwright/lib';

import NftMedia from './NftMedia';

test.describe('no url', () => {
  test.use({ viewport: { width: 250, height: 250 } });
  test('preview +@dark-mode', async({ render }) => {
    const data = {
      image_url: null,
      animation_url: null,
    } as TokenInstance;
    const component = await render(<NftMedia data={ data }/>);
    await expect(component).toHaveScreenshot();
  });

  test('with fallback', async({ render, mockAssetResponse }) => {
    const IMAGE_URL = 'https://localhost:3000/my-image.jpg';
    const data = {
      image_url: IMAGE_URL,
      animation_url: null,
    } as TokenInstance;

    await mockAssetResponse(IMAGE_URL, './playwright/mocks/image_long.jpg');
    const component = await render(<NftMedia data={ data }/>);
    await expect(component).toHaveScreenshot();
  });

  test('non-media url and fallback', async({ render, page, mockAssetResponse }) => {
    const ANIMATION_URL = 'https://localhost:3000/my-animation.m3u8';
    const ANIMATION_MEDIA_TYPE_API_URL = `/node-api/media-type?url=${ encodeURIComponent(ANIMATION_URL) }`;
    const IMAGE_URL = 'https://localhost:3000/my-image.jpg';
    const data = {
      animation_url: ANIMATION_URL,
      image_url: IMAGE_URL,
    } as TokenInstance;

    await page.route(ANIMATION_MEDIA_TYPE_API_URL, (route) => {
      return route.fulfill({
        status: 200,
        json: { type: undefined },
      });
    });
    await mockAssetResponse(IMAGE_URL, './playwright/mocks/image_long.jpg');

    const component = await render(<NftMedia data={ data }/>);
    await expect(component).toHaveScreenshot();
  });
});

test.describe('image', () => {
  const MEDIA_URL = 'https://localhost:3000/my-image.jpg';

  test.beforeEach(async({ mockAssetResponse }) => {
    await mockAssetResponse(MEDIA_URL, './playwright/mocks/image_long.jpg');
  });

  test('preview +@dark-mode', async({ render, page }) => {
    const data = {
      animation_url: MEDIA_URL,
      image_url: null,
    } as TokenInstance;
    await render(
      <Box boxSize="250px">
        <NftMedia data={ data }/>
      </Box>,
    );
    await expect(page).toHaveScreenshot({ clip: { x: 0, y: 0, width: 250, height: 250 } });
  });

  test('preview with thumbnails', async({ render, page, mockAssetResponse }) => {
    const THUMBNAIL_URL = 'https://localhost:3000/my-image-250.jpg';
    const data = {
      animation_url: MEDIA_URL,
      image_url: null,
      thumbnails: {
        '500x500': THUMBNAIL_URL,
      },
    } as TokenInstance;
    await mockAssetResponse(THUMBNAIL_URL, './playwright/mocks/image_md.jpg');
    await render(
      <Box boxSize="250px">
        <NftMedia data={ data }/>
      </Box>,
    );
    await expect(page).toHaveScreenshot({ clip: { x: 0, y: 0, width: 250, height: 250 } });
  });

  test('preview hover', async({ render, page }) => {
    const data = {
      animation_url: MEDIA_URL,
      image_url: null,
    } as TokenInstance;
    const component = await render(<NftMedia data={ data } w="250px"/>);
    await component.getByAltText('Token instance image').hover();
    await expect(page).toHaveScreenshot({ clip: { x: 0, y: 0, width: 250, height: 250 } });
  });

  test('fullscreen +@dark-mode +@mobile', async({ render, page }) => {
    const data = {
      animation_url: MEDIA_URL,
      image_url: null,
    } as TokenInstance;
    const component = await render(<NftMedia data={ data } withFullscreen w="250px"/>);
    await component.getByAltText('Token instance image').click();
    await expect(page).toHaveScreenshot();
  });
});

test.describe('page', () => {
  test.use({ viewport: { width: 250, height: 250 } });

  const MEDIA_URL = 'https://localhost:3000/page.html';
  const MEDIA_TYPE_API_URL = `/node-api/media-type?url=${ encodeURIComponent(MEDIA_URL) }`;

  test.beforeEach(async({ page, mockAssetResponse }) => {
    await mockAssetResponse(MEDIA_URL, './playwright/mocks/page.html');
    await page.route(MEDIA_TYPE_API_URL, (route) => route.fulfill({
      status: 200,
      json: { type: 'html' },
    }));
  });

  test('preview +@dark-mode', async({ render }) => {
    const data = {
      animation_url: MEDIA_URL,
      image_url: null,
    } as TokenInstance;

    const component = await render(<NftMedia data={ data }/>);
    await expect(component).toHaveScreenshot();
  });
});
