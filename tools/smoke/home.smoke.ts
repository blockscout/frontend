import { expect, test } from './fixture';

test('the home page shows the chain stats', async({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('link', { name: /^Latest block [\d,]+$/ })).toBeVisible();
  await expect(page.getByRole('link', { name: /^Total (txns|transactions) [\d,]+$/ })).toBeVisible();
});
