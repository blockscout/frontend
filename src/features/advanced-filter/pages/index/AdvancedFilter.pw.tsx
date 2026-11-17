import * as csvExportMock from 'src/features/csv-export/mocks';

import { ENVS_MAP } from 'src/config/test-utils/env-presets';

import { expect, test } from 'playwright/lib';

import * as advancedFilterMock from '../../mocks';
import AdvancedFilter from './AdvancedFilter';

test('base view +@dark-mode', async({ render, mockApiResponse, mockTextAd, mockEnvs }) => {
  await mockEnvs(ENVS_MAP.additionalTokenTypes);
  await mockTextAd();
  await mockApiResponse('core:advanced_filter', advancedFilterMock.baseResponse);
  await mockApiResponse('core:tokens', { items: [], next_page_params: null }, { queryParams: { limit: '7', q: '' } });
  await mockApiResponse('core:advanced_filter_methods', [], { queryParams: { q: '' } });
  await mockApiResponse('core:config_csv_export', csvExportMock.config);

  const component = await render(<AdvancedFilter/>);

  await expect(component).toHaveScreenshot();
});
