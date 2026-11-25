import { expect, test } from './fixture';
import { fetchAppEnvs } from './instance';
import type { PostHogEvent } from './posthog';
import { isPostHogCaptureUrl, readPostHogEvents } from './posthog';

// The api_host source - src/services/mixpanel/provider.ts
const MIXPANEL_API_ORIGIN = 'https://api-eu.mixpanel.com';

test('the analytics initialization request is sent', async({ page, request }) => {
  const envs = await fetchAppEnvs(request);
  expect(envs.NEXT_PUBLIC_MIXPANEL_PROJECT_TOKEN, 'the preset turns Mixpanel on').toBeTruthy();

  const initResponse = page.waitForResponse((response) => new URL(response.url()).origin === MIXPANEL_API_ORIGIN);
  await page.goto('/');

  expect((await initResponse).ok()).toBe(true);
});

// the capture requests never reach PostHog: the fixture answers them
test('the PostHog page view event is sent', async({ page, request }) => {
  const envs = await fetchAppEnvs(request);
  expect(envs.NEXT_PUBLIC_POSTHOG_API_KEY, 'the preset turns PostHog on').toBeTruthy();

  const sentEvents: Array<PostHogEvent> = [];
  page.on('request', (captureRequest) => {
    if (isPostHogCaptureUrl(new URL(captureRequest.url()))) {
      sentEvents.push(...readPostHogEvents(captureRequest));
    }
  });

  await page.goto('/');

  await expect.poll(
    () => sentEvents.find(({ event }) => event === '$pageview')?.properties,
    'a $pageview event sent to the PostHog capture endpoint',
  ).toMatchObject({ 'Page type': 'Homepage' });
});
