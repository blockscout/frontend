import React from 'react';

import * as indexingStatusMock from 'src/slices/chain/indexing-status/mocks';
import * as chainMock from 'src/slices/chain/mocks';

import { test, expect } from 'playwright/lib';
import * as pwConfig from 'playwright/utils/config';

import Footer from './Footer';
import { FOOTER_LINKS } from './mocks';

const FOOTER_LINKS_URL = 'https://localhost:3000/footer-links.json';

test.describe('with custom links, max cols', () => {
  test.beforeEach(async({ render, mockApiResponse, mockConfigResponse, injectMetaMaskProvider, mockEnvs, mockAssetResponse }) => {
    await mockEnvs([
      [ 'NEXT_PUBLIC_FOOTER_LINKS', FOOTER_LINKS_URL ],
    ]);
    await mockConfigResponse('NEXT_PUBLIC_FOOTER_LINKS', FOOTER_LINKS_URL, FOOTER_LINKS);
    await injectMetaMaskProvider();
    await mockApiResponse('core:homepage_indexing_status', indexingStatusMock.inProgress);
    await mockApiResponse('core:config_backend_version', chainMock.backendVersion);
    await mockAssetResponse(FOOTER_LINKS[3].links[0].iconUrl?.[0]!, './playwright/mocks/image_s.jpg');
    await mockAssetResponse(FOOTER_LINKS[3].links[0].iconUrl?.[1]!, './playwright/mocks/image_svg.svg');

    await render(<Footer/>);
  });

  test('+@mobile +@dark-mode', async({ page }) => {
    await expect(page).toHaveScreenshot();
  });

  test.describe('screen xl', () => {
    test.use({ viewport: pwConfig.viewport.xl });

    test('base view', async({ page }) => {
      await expect(page).toHaveScreenshot();
    });
  });
});

test.describe('with custom links, min cols', () => {
  test('base view +@dark-mode +@mobile', async({ render, page, mockConfigResponse, mockEnvs, mockApiResponse }) => {
    await mockEnvs([
      [ 'NEXT_PUBLIC_FOOTER_LINKS', FOOTER_LINKS_URL ],
    ]);
    await mockConfigResponse('NEXT_PUBLIC_FOOTER_LINKS', FOOTER_LINKS_URL, [ FOOTER_LINKS[0] ]);
    await mockApiResponse('core:homepage_indexing_status', indexingStatusMock.finished);
    await mockApiResponse('core:config_backend_version', chainMock.backendVersion);
    await render(<Footer/>);
    await expect(page).toHaveScreenshot();
  });
});

test.describe('without custom links', () => {
  test('base view +@dark-mode +@mobile', async({ render, page, injectMetaMaskProvider, mockApiResponse }) => {
    await injectMetaMaskProvider();
    await mockApiResponse('core:homepage_indexing_status', indexingStatusMock.finished);
    await mockApiResponse('core:config_backend_version', chainMock.backendVersion);
    await render(<Footer/>);
    await expect(page).toHaveScreenshot();
  });

  test('with indexing alert +@dark-mode +@mobile', async({ render, injectMetaMaskProvider, mockApiResponse }) => {
    await injectMetaMaskProvider();
    await mockApiResponse('core:homepage_indexing_status', indexingStatusMock.inProgress);
    await mockApiResponse('core:config_backend_version', chainMock.backendVersion);

    const component = await render(<Footer/>);
    await expect(component).toHaveScreenshot();
  });

  test('with full info +@mobile', async({ render, page, injectMetaMaskProvider, mockApiResponse, mockEnvs }) => {
    await injectMetaMaskProvider();
    await mockEnvs([
      [ 'NEXT_PUBLIC_USERCENTRICS_CONFIG', JSON.stringify({ settingsId: '123' }) ],
    ]);
    await mockApiResponse('core:homepage_indexing_status', indexingStatusMock.inProgress);
    await mockApiResponse('core:config_backend_version', chainMock.backendVersion);

    await render(<Footer/>, undefined, {
      appContext: {
        pageProps: {
          onionDomain: 'some-onion-domain.onion',
        },
      },
    });
    await expect(page).toHaveScreenshot();
  });
});
