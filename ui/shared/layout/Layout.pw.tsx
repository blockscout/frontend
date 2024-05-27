import React from 'react';

import { indexingStatus } from 'mocks/stats/index';
import { test, expect } from 'playwright/lib';

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
