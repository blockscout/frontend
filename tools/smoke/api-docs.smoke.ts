import { expect, test } from './fixture';

test('the API documentation page renders an API definition', async({ page }) => {
  await page.goto('/api-docs');
  await expect(page.getByRole('heading', { level: 1, name: 'API documentation' })).toBeVisible();

  // not the core API section: its definition is fetched for the backend's release, which an unreleased staging backend has none of
  await page.getByRole('button', { name: 'Stats API' }).click();

  await expect(page.getByRole('button', { name: /^GET \/api\/v1\// }).first()).toBeVisible();
});
