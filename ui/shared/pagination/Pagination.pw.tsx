import { test, expect } from '@playwright/experimental-ct-react';
import React from 'react';

import type { PaginationParams } from './types';

import TestApp from 'playwright/TestApp';

import Pagination from './Pagination';

test.use({ viewport: { width: 250, height: 50 } });

test('default view', async({ mount }) => {
  const props: PaginationParams = {
    page: 2,
    isVisible: true,
    isLoading: false,
    hasNextPage: true,
    hasPages: true,
    canGoBackwards: false,
    onNextPageClick: () => {},
    onPrevPageClick: () => {},
    resetPage: () => {},
  };
  const component = await mount(
    <TestApp>
      <Pagination { ...props } w="fit-content"/>
    </TestApp>,
  );

  await expect(component).toHaveScreenshot();
});
