import { expect, test } from './fixture';
import { fetchAppEnvs } from './instance';

// The api_host source - src/services/mixpanel/provider.ts
const MIXPANEL_API_ORIGIN = 'https://api-eu.mixpanel.com';

// PostHog, on in the preset too, is left out: it drops every event from an automated browser (`navigator.webdriver`,
// the `HeadlessChrome` brand), so it sends no request to observe
test('the analytics initialization request is sent', async({ page, request }) => {
  const envs = await fetchAppEnvs(request);
  expect(envs.NEXT_PUBLIC_MIXPANEL_PROJECT_TOKEN, 'the preset turns Mixpanel on').toBeTruthy();

  const initResponse = page.waitForResponse((response) => new URL(response.url()).origin === MIXPANEL_API_ORIGIN);
  await page.goto('/');

  expect((await initResponse).ok()).toBe(true);
});
