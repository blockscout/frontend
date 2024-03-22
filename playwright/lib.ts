/* eslint-disable no-console */
import { test } from '@playwright/experimental-ct-react';

import * as textAdMock from 'mocks/ad/textAd';

test.beforeEach(async({ page }) => {
  // debug
  if (process.env.PWDEBUG === '1') {
    page.on('console', msg => console.log(msg.text()));
    page.on('request', request => console.info('\x1b[34m%s\x1b[0m', '>>', request.method(), request.url()));
    page.on('response', response => console.info('\x1b[35m%s\x1b[0m', '<<', String(response.status()), response.url()));
  }

  await page.route('**', (route) => {
    if (!route.request().url().startsWith('http://localhost')) {
      console.info('Aborting request to', route.request().url());
      route.abort();
    } else {
      route.continue();
    }
  });

  // Text AD
  await page.route('https://request-global.czilladx.com/serve/native.php?z=19260bf627546ab7242', (route) => route.fulfill({
    status: 200,
    body: JSON.stringify(textAdMock.duck),
  }));

  await page.route(textAdMock.duck.ad.thumbnail, (route) => {
    return route.fulfill({
      status: 200,
      path: './playwright/mocks/image_s.jpg',
    });
  });
});

export * from '@playwright/experimental-ct-react';
export { test };
