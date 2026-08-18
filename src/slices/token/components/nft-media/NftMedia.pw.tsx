import { Box } from '@chakra-ui/react';
import React from 'react';

import * as tokenInfoMock from 'src/slices/token/mocks/info';

import { test, expect } from 'playwright/lib';

import { toTokenInstanceModel } from '../../utils/model';
import NftMedia from './NftMedia';

const TOKEN_ID = '123';
const TOKEN_HASH = tokenInfoMock.tokenInfoERC721a.address_hash;

test.describe('no url', () => {
  test.use({ viewport: { width: 250, height: 250 } });
  test('preview +@dark-mode', async({ render }) => {
    const data = toTokenInstanceModel({
      id: TOKEN_ID,
      image_url: null,
      animation_url: null,
      token: tokenInfoMock.tokenInfoERC721a,
    });
    const component = await render(<NftMedia data={ data } addressHash={ TOKEN_HASH }/>);
    await expect(component).toHaveScreenshot();
  });

  test('with fallback', async({ render, mockAssetResponse }) => {
    const IMAGE_URL = 'https://localhost:3000/my-image.jpg';
    const data = toTokenInstanceModel({
      id: TOKEN_ID,
      image_url: IMAGE_URL,
      animation_url: null,
      token: tokenInfoMock.tokenInfoERC721a,
    });

    await mockAssetResponse(IMAGE_URL, './playwright/mocks/image_long.jpg');
    const component = await render(<NftMedia data={ data } addressHash={ TOKEN_HASH }/>);
    await expect(component).toHaveScreenshot();
  });

  test('non-media url and fallback', async({ render, mockAssetResponse }) => {
    const ANIMATION_URL = 'https://localhost:3000/my-animation.m3u8';
    const IMAGE_URL = 'https://localhost:3000/my-image.jpg';
    const data = toTokenInstanceModel({
      id: TOKEN_ID,
      animation_url: ANIMATION_URL,
      animation_media_type: null,
      image_url: IMAGE_URL,
      token: tokenInfoMock.tokenInfoERC721a,
    });

    await mockAssetResponse(IMAGE_URL, './playwright/mocks/image_long.jpg');

    const component = await render(<NftMedia data={ data } addressHash={ TOKEN_HASH }/>);
    await expect(component).toHaveScreenshot();
  });
});

test.describe('image', () => {
  const MEDIA_URL = 'https://localhost:3000/my-image.jpg';

  test.beforeEach(async({ mockAssetResponse }) => {
    await mockAssetResponse(MEDIA_URL, './playwright/mocks/image_long.jpg');
  });

  test('preview +@dark-mode', async({ render, page }) => {
    const data = toTokenInstanceModel({
      id: TOKEN_ID,
      animation_url: MEDIA_URL,
      image_url: null,
      token: tokenInfoMock.tokenInfoERC721a,
    });
    await render(
      <Box boxSize="250px">
        <NftMedia data={ data } addressHash={ TOKEN_HASH } size="md"/>
      </Box>,
    );
    await expect(page).toHaveScreenshot({ clip: { x: 0, y: 0, width: 250, height: 250 } });
  });

  test('preview with thumbnails', async({ render, page, mockAssetResponse }) => {
    const THUMBNAIL_URL = 'https://localhost:3000/my-image-250.jpg';
    const data = toTokenInstanceModel({
      id: TOKEN_ID,
      animation_url: MEDIA_URL,
      image_url: null,
      thumbnails: {
        '500x500': THUMBNAIL_URL,
        original: THUMBNAIL_URL,
      },
      token: tokenInfoMock.tokenInfoERC721a,
    });
    await mockAssetResponse(THUMBNAIL_URL, './playwright/mocks/image_md.jpg');
    await render(
      <Box boxSize="250px">
        <NftMedia data={ data } addressHash={ TOKEN_HASH } size="md"/>
      </Box>,
    );
    await expect(page).toHaveScreenshot({ clip: { x: 0, y: 0, width: 250, height: 250 } });
  });

  test('preview hover', async({ render, page }) => {
    const data = toTokenInstanceModel({
      id: TOKEN_ID,
      animation_url: MEDIA_URL,
      image_url: null,
      token: tokenInfoMock.tokenInfoERC721a,
    });
    const component = await render(<NftMedia data={ data } addressHash={ TOKEN_HASH } w="250px" size="md"/>);
    await component.getByRole('img', { name: 'Token instance image' }).hover();
    await expect(page).toHaveScreenshot({ clip: { x: 0, y: 0, width: 250, height: 250 } });
  });

  test('fullscreen +@dark-mode +@mobile', async({ render, page }) => {
    const data = toTokenInstanceModel({
      id: TOKEN_ID,
      animation_url: MEDIA_URL,
      image_url: null,
      token: tokenInfoMock.tokenInfoERC721a,
    });
    const component = await render(<NftMedia data={ data } addressHash={ TOKEN_HASH } withFullscreen w="250px"/>);
    await component.getByRole('img', { name: 'Token instance image' }).click();
    await expect(page).toHaveScreenshot();
  });
});

test.describe('page', () => {
  test.use({ viewport: { width: 250, height: 250 } });

  const MEDIA_URL = 'https://localhost:3000/page.html';

  test.beforeEach(async({ mockAssetResponse }) => {
    await mockAssetResponse(MEDIA_URL, './playwright/mocks/page.html');
  });

  test('preview +@dark-mode', async({ render }) => {
    const data = toTokenInstanceModel({
      id: TOKEN_ID,
      animation_url: MEDIA_URL,
      animation_media_type: 'html',
      image_url: null,
      token: tokenInfoMock.tokenInfoERC721a,
    });

    const component = await render(<NftMedia data={ data } addressHash={ TOKEN_HASH }/>);
    await expect(component).toHaveScreenshot();
  });
});
