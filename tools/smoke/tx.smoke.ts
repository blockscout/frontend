import { route } from 'src/shared/router/routes';

import { expect, test } from './fixture';
import { fetchLatestTransaction } from './instance';

test('a transaction page shows the transaction', async({ page, request }) => {
  const transaction = await fetchLatestTransaction(request);

  await page.goto(route({ pathname: '/tx/[hash]', query: { hash: transaction.hash } }));

  await expect(page.getByRole('heading', { level: 1, name: 'Transaction details' })).toBeVisible();
  const details = page.getByRole('tabpanel', { name: 'Details' });
  await expect(details.getByText(transaction.hash, { exact: true })).toBeVisible();
  // a transaction sent to its own sender links the address twice
  await expect(details.getByRole('link', { name: transaction.from.hash, exact: true }).first()).toBeVisible();
});
