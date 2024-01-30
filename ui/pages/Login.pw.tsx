import { test as base, expect } from '@playwright/experimental-ct-react';
import React from 'react';

import contextWithFeatures from 'playwright/fixtures/contextWithFeatures';
import TestApp from 'playwright/TestApp';

import Login from './Login';

const testWithFeature = base.extend({
  context: contextWithFeatures([
    { id: 'test_value', value: 'kitty' },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ]) as any,
});

testWithFeature('has feature text', async({ mount }) => {
  const component = await mount(
    <TestApp>
      <Login/>
    </TestApp>,
  );

  const featureText = component.getByText('kitty');
  await expect(featureText).toBeVisible();
});
