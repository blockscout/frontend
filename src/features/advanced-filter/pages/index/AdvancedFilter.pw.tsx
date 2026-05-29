import React from 'react';

import { test, expect } from 'playwright/lib';

import * as advancedFilterMock from '../../mocks';
import AdvancedFilter from './AdvancedFilter';

test('base view +@dark-mode', async({ render, mockApiResponse, mockTextAd }) => {
  await mockTextAd();
  await mockApiResponse('core:advanced_filter', advancedFilterMock.baseResponse);
  await mockApiResponse('core:tokens', { items: [], next_page_params: null }, { queryParams: { limit: '7', q: '' } });
  await mockApiResponse('core:advanced_filter_methods', [], { queryParams: { q: '' } });

  const component = await render(<AdvancedFilter/>);

  await expect(component).toHaveScreenshot();
});
