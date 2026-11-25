import { route } from 'src/shared/router/routes';

import { expect, test } from './fixture';
import { fetchLatestTransaction } from './instance';

test('an address page shows the address', async({ page, request }) => {
  const { from: address } = await fetchLatestTransaction(request);

  await page.goto(route({ pathname: '/address/[hash]', query: { hash: address.hash } }));

  await expect(page.getByRole('heading', { level: 1, name: 'Address details' })).toBeVisible();
  await expect(page.getByText(address.hash, { exact: true })).toBeVisible();
  await expect(page.getByRole('tab', { name: /^Transactions [1-9]\d*\+?$/ })).toBeVisible();
});
