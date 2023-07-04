import { LightMode } from '@chakra-ui/react';
import { test, expect } from '@playwright/experimental-ct-react';
import React from 'react';

import TestApp from 'playwright/TestApp';

import SearchBarInput from './SearchBarInput';

const props = {
  onChange: () => {},
  onSubmit: () => {},
  onClear: () => {},
  value: 'duck duck',
};

test('input on regular page +@mobile +@dark-mode', async({ mount, page }) => {
  await mount(
    <TestApp>
      <SearchBarInput { ...props }/>
    </TestApp>,
  );
  const input = page.getByPlaceholder(/search by/i);

  await expect(input).toHaveScreenshot();
});

test('input on home page +@mobile +@dark-mode', async({ mount, page }) => {
  await mount(
    <TestApp>
      <LightMode>
        <SearchBarInput { ...props } isHomepage/>
      </LightMode>
    </TestApp>,
  );
  const input = page.getByPlaceholder(/search by/i);

  await expect(input).toHaveScreenshot();
});
