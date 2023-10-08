import { test as base, expect } from '@playwright/experimental-ct-react';
import React from 'react';

import contextWithEnvs from 'playwright/fixtures/contextWithEnvs';
import TestApp from 'playwright/TestApp';
import buildApiUrl from 'playwright/utils/buildApiUrl';

import Layout from './Layout';

const API_URL = buildApiUrl('homepage_indexing_status');

const test = base.extend({
  context: contextWithEnvs([
    {
      name: 'NEXT_PUBLIC_MAINTENANCE_ALERT_MESSAGE',
      value: 'We are currently lacking pictures of <i>ducks</i>. Please <a href="mailto:duck@blockscout.com">send</a> us one.',
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ]) as any,
});

test('base view +@mobile', async({ mount, page }) => {
  await page.route(API_URL, (route) => route.fulfill({
    status: 200,
    body: JSON.stringify({ finished_indexing_blocks: false, indexed_blocks_ratio: 0.1 }),
  }));

  const component = await mount(
    <TestApp>
      <Layout>Page Content</Layout>
    </TestApp>,
  );

  await expect(component).toHaveScreenshot();
});
