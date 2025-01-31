import React from 'react';

import { indexingStatus } from 'mocks/stats/index';
import { test, expect } from 'playwright/lib';
import * as pwConfig from 'playwright/utils/config';

import Layout from './Layout';

test('base view +@mobile', async({ render, mockEnvs, mockApiResponse }) => {
  await mockEnvs([
    [
      'NEXT_PUBLIC_MAINTENANCE_ALERT_MESSAGE',
      'We are currently lacking pictures of <i>ducks</i>. Please <a href="mailto:duck@blockscout.com">send</a> us one.',
    ],
  ]);
  await mockApiResponse('homepage_indexing_status', indexingStatus);
  const component = await render(<Layout>Page Content</Layout>);
  await expect(component).toHaveScreenshot();
});

test.describe('xxl screen', () => {
  test.use({ viewport: pwConfig.viewport.xxl });

  test('vertical navigation', async({ render }) => {
    const component = await render(<Layout>Page Content</Layout>);
    await expect(component).toHaveScreenshot();
  });

  test('horizontal navigation', async({ render, mockEnvs }) => {
    await mockEnvs([
      [ 'NEXT_PUBLIC_NAVIGATION_LAYOUT', 'horizontal' ],
    ]);
    const component = await render(<Layout>Page Content</Layout>);
    await expect(component).toHaveScreenshot();
  });
});
