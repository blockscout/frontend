import type { Page } from '@playwright/test';
import { test as base, expect } from '@playwright/test';

import { isAllowedPageError } from './allowlist';

const watchPageFailures = (page: Page, appOrigin: string): Array<string> => {
  const failures: Array<string> = [];
  const isAppUrl = (url: string) => new URL(url).origin === appOrigin;

  page.on('pageerror', (error) => {
    if (!isAllowedPageError(error)) {
      failures.push(`Uncaught exception: ${ error.stack ?? error.message }`);
    }
  });

  page.on('requestfailed', (request) => {
    const errorText = request.failure()?.errorText;
    // a navigation cancels whatever the page it leaves still had in flight; the app did not fail those requests
    if (isAppUrl(request.url()) && errorText !== 'net::ERR_ABORTED') {
      failures.push(`Failed request: ${ request.method() } ${ request.url() } (${ errorText })`);
    }
  });

  page.on('response', (response) => {
    if (isAppUrl(response.url()) && response.status() >= 500) {
      failures.push(`Server error: ${ response.status() } on ${ response.request().method() } ${ response.url() }`);
    }
  });

  return failures;
};

export const test = base.extend<{ failureRules: void }>({
  failureRules: [ async({ page, baseURL }, use) => {
    if (!baseURL) {
      throw new Error('The smoke config sets no baseURL');
    }

    const failures = watchPageFailures(page, new URL(baseURL).origin);
    await use();
    expect(failures, 'uncaught exceptions and failed requests to the app').toEqual([]);
  }, { auto: true } ],
});

export { expect };
