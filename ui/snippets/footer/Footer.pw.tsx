import React from 'react';

import { FOOTER_LINKS } from 'mocks/config/footerLinks';
import type { StorageState } from 'playwright/fixtures/storageState';
import * as storageState from 'playwright/fixtures/storageState';
import { test as base, expect } from 'playwright/lib';
import * as configs from 'playwright/utils/configs';

import Footer from './Footer';

const FOOTER_LINKS_URL = 'https://localhost:3000/footer-links.json';

const customLinksTest = base.extend<{ storageState: StorageState }>({
  storageState: storageState.fixture([
    storageState.addEnv('NEXT_PUBLIC_FOOTER_LINKS', FOOTER_LINKS_URL),
  ]),
});

customLinksTest.describe('with custom links, max cols', () => {
  customLinksTest.beforeEach(async({ render, mockApiResponse, mockConfigResponse, injectMetaMaskProvider }) => {
    await mockConfigResponse('NEXT_PUBLIC_FOOTER_LINKS', FOOTER_LINKS_URL, JSON.stringify(FOOTER_LINKS));
    await injectMetaMaskProvider();
    await mockApiResponse('homepage_indexing_status', {
      finished_indexing: false,
      finished_indexing_blocks: false,
      indexed_internal_transactions_ratio: '0.1',
      indexed_blocks_ratio: '0.1',
    });

    await render(<Footer/>);
  });

  customLinksTest('+@mobile +@dark-mode', async({ page }) => {
    await expect(page).toHaveScreenshot();
  });

  customLinksTest.describe('screen xl', () => {
    customLinksTest.use({ viewport: configs.viewport.xl });

    customLinksTest('', async({ page }) => {
      await expect(page).toHaveScreenshot();
    });
  });
});

customLinksTest.describe('with custom links, min cols', () => {
  customLinksTest('base view +@dark-mode +@mobile', async({ render, page, mockConfigResponse }) => {
    await mockConfigResponse('NEXT_PUBLIC_FOOTER_LINKS', FOOTER_LINKS_URL, JSON.stringify([ FOOTER_LINKS[0] ]));
    await render(<Footer/>);
    await expect(page).toHaveScreenshot();
  });
});

base.describe('without custom links', () => {
  base('base view +@dark-mode +@mobile', async({ render, page, injectMetaMaskProvider, mockApiResponse }) => {
    await injectMetaMaskProvider();
    await mockApiResponse('config_backend_version', { backend_version: 'v5.2.0-beta.+commit.1ce1a355' });
    await render(<Footer/>);
    await expect(page).toHaveScreenshot();
  });

  base('with indexing alert +@dark-mode +@mobile', async({ render, injectMetaMaskProvider, mockApiResponse }) => {
    await injectMetaMaskProvider();
    await mockApiResponse('homepage_indexing_status', {
      finished_indexing: false,
      finished_indexing_blocks: false,
      indexed_internal_transactions_ratio: '0.1',
      indexed_blocks_ratio: '0.1',
    });

    const component = await render(<Footer/>);
    await expect(component).toHaveScreenshot();
  });
});
