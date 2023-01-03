import type { Page } from 'playwright-core';

export default async function insertAdPlaceholder(page: Page) {
  await page.waitForSelector('#adBanner', { state: 'attached' });
  await page.evaluate(() => {
    const adContainer = document.getElementById('adBanner');
    const adReplacer = document.createElement('div');
    adReplacer.style.width = '200px';
    adReplacer.style.height = '100px';
    adReplacer.style.background = '#f00';
    adContainer?.replaceChildren(adReplacer);
  });
}
