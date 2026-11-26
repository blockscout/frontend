import type { EssentialDappsConfig } from 'src/features/marketplace/types/client';

// the cookies module and src/config import each other; entered through the cookies module, the graph reads its
// cookie names before they are initialized
import 'src/config';
import { parseEnvJson, replaceQuotes } from 'src/config/utils/envs';
import { NAMES as COOKIE_NAMES } from 'src/shared/storage/cookies';

import { FAKE_WALLET, injectFakeWallet } from './fake_wallet';
import { expect, test } from './fixture';
import { fetchAppEnvs } from './instance';

const WIDGET_SHORT_ADDRESS = `${ FAKE_WALLET.address.slice(0, 7) }...${ FAKE_WALLET.address.slice(-5) }`;

test('the swap widget shows the wallet connected through its own connect button', async({ page, context, request, baseURL }) => {
  const envs = await fetchAppEnvs(request);
  const essentialDapps = parseEnvJson<EssentialDappsConfig>(replaceQuotes(envs.NEXT_PUBLIC_MARKETPLACE_ESSENTIAL_DAPPS_CONFIG));
  expect(essentialDapps?.swap, 'the preset turns the swap essential dapp on').toBeDefined();

  // the ad slots under the widget are third-party content the test does not cover; with the cookie the app leaves them empty
  await context.addCookies([ { name: COOKIE_NAMES.ADBLOCK_DETECTED, value: 'true', url: baseURL } ]);
  await injectFakeWallet(page, Number(envs.NEXT_PUBLIC_NETWORK_ID));

  await page.goto('/essential-dapps/swap');
  const widgetFrame = page.getByTitle('LI.FI Widget');
  await expect(widgetFrame).toBeVisible();
  const widget = widgetFrame.contentFrame();

  // not the header's button: a connection from there is followed by the sign-in, whose dialog stays open over the frame
  await widget.getByRole('button', { name: 'Connect wallet' }).click();
  await page.locator('w3m-modal').getByRole('button', { name: `${ FAKE_WALLET.name } installed` }).click();
  await expect(widget.getByRole('button', { name: 'Connect wallet' })).toBeHidden();

  await widget.getByRole('button', { name: 'Send to a different wallet' }).click();
  await widget.getByRole('button', { name: /^Connected wallets/ }).click();
  await expect(widget.getByRole('button', { name: `${ FAKE_WALLET.name } ${ WIDGET_SHORT_ADDRESS }` })).toBeVisible();
});
