import React from 'react';

import type { MultichainProviderConfig } from 'src/features/multichain-button/types/client';

import { test, expect } from 'playwright/lib';
import * as pwConfig from 'playwright/utils/config';

import MultichainAddressPortfolioNetWorth from './MultichainAddressPortfolioNetWorth';

const ICON_URL = 'https://localhost:3000/my-icon.png';
const ICON_URL_2 = 'https://localhost:3000/my-icon-2.png';
const ADDRESS_HASH = '0x1234567890123456789012345678901234567890';
const TOP_TOKENS = [ { symbol: 'USDT', share: 0.5 }, { symbol: 'DuckDuckToken', share: 0.3 }, { symbol: 'Others', share: 0.2 } ];

test.beforeEach(async({ mockEnvs, mockAssetResponse }) => {
  await mockEnvs([
    [ 'NEXT_PUBLIC_MULTICHAIN_BALANCE_PROVIDER_CONFIG', JSON.stringify([
      { name: 'Duck portfolio', dapp_id: 'duck', url_template: 'https://duck.url/{address}', logo: ICON_URL },
      { name: 'duck3', dapp_id: 'duck', url_template: 'https://duck.url/{address}', logo: ICON_URL, view: 'icon' },
      { name: 'Goose tracker', url_template: 'https://duck.url/{address}', logo: ICON_URL_2, view: 'full' },
      { name: 'goose', url_template: 'https://duck.url/{address}', logo: ICON_URL_2, view: 'icon' },
    ] satisfies Array<MultichainProviderConfig>) ],
  ]);

  await mockAssetResponse(ICON_URL, './playwright/mocks/duck.png');
  await mockAssetResponse(ICON_URL_2, './playwright/mocks/goose.png');
});

test('base view +@mobile', async({ render, page }) => {
  const component = await render(
    <MultichainAddressPortfolioNetWorth
      addressHash={ ADDRESS_HASH }
      netWorth="449022.89544"
      isLoading={ false }
      topTokens={ TOP_TOKENS }
    />,
  );

  await expect(component).toHaveScreenshot({
    mask: [ page.locator(pwConfig.adsBannerSelector) ],
    maskColor: pwConfig.maskColor,
  });
});

test.describe('md desktop', () => {
  test.use({ viewport: { width: 1024, height: 768 } });
  test('base view', async({ render, page }) => {
    const component = await render(
      <MultichainAddressPortfolioNetWorth
        addressHash={ ADDRESS_HASH }
        netWorth="449022.89544"
        isLoading={ false }
        topTokens={ TOP_TOKENS }
      />,
    );
    await expect(component).toHaveScreenshot({
      mask: [ page.locator(pwConfig.adsBannerSelector) ],
      maskColor: pwConfig.maskColor,
    });
  });
});
