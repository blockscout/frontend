import { test, expect } from '@playwright/experimental-ct-react';
import React from 'react';

import TestApp from 'playwright/TestApp';

import NftMedia from './NftMedia';

test.describe('no url', () => {
  test.use({ viewport: { width: 250, height: 250 } });
  test('preview +@dark-mode', async({ mount }) => {
    const component = await mount(
      <TestApp>
        <NftMedia animationUrl={ null } imageUrl={ null }/>
      </TestApp>,
    );

    await expect(component).toHaveScreenshot();
  });

  test('with fallback', async({ mount, page }) => {
    const IMAGE_URL = 'https://localhost:3000/my-image.jpg';

    await page.route(IMAGE_URL, (route) => {
      return route.fulfill({
        status: 200,
        path: './playwright/mocks/image_long.jpg',
      });
    });

    const component = await mount(
      <TestApp>
        <NftMedia animationUrl={ null } imageUrl={ IMAGE_URL }/>
      </TestApp>,
    );

    await expect(component).toHaveScreenshot();
  });

  test('non-media url and fallback', async({ mount, page }) => {
    const ANIMATION_URL = 'https://localhost:3000/my-animation.m3u8';
    const ANIMATION_MEDIA_TYPE_API_URL = `/node-api/media-type?url=${ encodeURIComponent(ANIMATION_URL) }`;
    const IMAGE_URL = 'https://localhost:3000/my-image.jpg';

    await page.route(ANIMATION_MEDIA_TYPE_API_URL, (route) => {
      return route.fulfill({
        status: 200,
        body: JSON.stringify({ type: undefined }),
      });
    });

    await page.route(IMAGE_URL, (route) => {
      return route.fulfill({
        status: 200,
        path: './playwright/mocks/image_long.jpg',
      });
    });

    const component = await mount(
      <TestApp>
        <NftMedia animationUrl={ ANIMATION_URL } imageUrl={ IMAGE_URL }/>
      </TestApp>,
    );

    await expect(component).toHaveScreenshot();
  });
});

test.describe('image', () => {
  test.use({ viewport: { width: 250, height: 250 } });

  const MEDIA_URL = 'https://localhost:3000/my-image.jpg';

  test.beforeEach(async({ page }) => {
    await page.route(MEDIA_URL, (route) => {
      return route.fulfill({
        status: 200,
        path: './playwright/mocks/image_long.jpg',
      });
    });
  });

  test('preview +@dark-mode', async({ mount }) => {
    const component = await mount(
      <TestApp>
        <NftMedia animationUrl={ MEDIA_URL } imageUrl={ null }/>
      </TestApp>,
    );

    await expect(component).toHaveScreenshot();
  });
});

test('image preview hover', async({ mount, page }) => {
  const MEDIA_URL = 'https://localhost:3000/my-image.jpg';

  await page.route(MEDIA_URL, (route) => {
    return route.fulfill({
      status: 200,
      path: './playwright/mocks/image_long.jpg',
    });
  });

  const component = await mount(
    <TestApp>
      <NftMedia animationUrl={ MEDIA_URL } imageUrl={ null } w="250px"/>
    </TestApp>,
  );

  await component.getByAltText('Token instance image').hover();

  await expect(page).toHaveScreenshot({ clip: { x: 0, y: 0, width: 250, height: 250 } });
});

test('image fullscreen +@dark-mode +@mobile', async({ mount, page }) => {
  const MEDIA_URL = 'https://localhost:3000/my-image.jpg';

  await page.route(MEDIA_URL, (route) => {
    return route.fulfill({
      status: 200,
      path: './playwright/mocks/image_long.jpg',
    });
  });
  const component = await mount(
    <TestApp>
      <NftMedia animationUrl={ MEDIA_URL } imageUrl={ null } withFullscreen w="250px"/>
    </TestApp>,
  );

  await component.getByAltText('Token instance image').click();

  await expect(page).toHaveScreenshot();
});

test.describe('page', () => {
  test.use({ viewport: { width: 250, height: 250 } });

  const MEDIA_URL = 'https://localhost:3000/page.html';
  const MEDIA_TYPE_API_URL = `/node-api/media-type?url=${ encodeURIComponent(MEDIA_URL) }`;

  test.beforeEach(async({ page }) => {

    await page.route(MEDIA_URL, (route) => {
      return route.fulfill({
        status: 200,
        path: './playwright/mocks/page.html',
      });
    });
    await page.route(MEDIA_TYPE_API_URL, (route) => route.fulfill({
      status: 200,
      body: JSON.stringify({ type: 'html' }),
    }));
  });

  test('preview +@dark-mode', async({ mount }) => {
    const component = await mount(
      <TestApp>
        <NftMedia animationUrl={ MEDIA_URL } imageUrl={ null }/>
      </TestApp>,
    );

    await expect(component).toHaveScreenshot();
  });
});
