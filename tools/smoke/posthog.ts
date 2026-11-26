import type { Request } from '@playwright/test';
import { gunzipSync } from 'zlib';

export interface PostHogEvent {
  readonly event: string;
  readonly properties: Readonly<Record<string, unknown>>;
}

// The api_host source - src/services/posthog/provider.ts
const POSTHOG_API_ORIGIN = 'https://eu.i.posthog.com';
// The capture endpoint source - node_modules/posthog-js/lib/src/posthog-core.js
const POSTHOG_CAPTURE_PATH = '/e/';

export const isPostHogCaptureUrl = (url: URL): boolean => url.origin === POSTHOG_API_ORIGIN && url.pathname === POSTHOG_CAPTURE_PATH;

// The capture body format source - node_modules/posthog-js/lib/src/request.js
// always gzip, and always to the path above: the app turns off PostHog's remote config (`advanced_disable_flags`),
// the one thing that could switch either
export const readPostHogEvents = (request: Request): Array<PostHogEvent> => {
  const body = request.postDataBuffer();
  if (!body) {
    return [];
  }

  const { batch } = JSON.parse(gunzipSync(body).toString()) as { batch: Array<PostHogEvent> };
  return batch;
};
