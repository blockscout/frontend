import type { BrowserContext, TestFixture } from '@playwright/test';

import * as cookies from 'client/shared/storage/cookies';

import config from 'configs/app';

export function authenticateUser(context: BrowserContext) {
  context.addCookies([ { name: cookies.NAMES.API_TOKEN, value: 'foo', domain: config.app.host, path: '/' } ]);
}

export const contextWithAuth: TestFixture<BrowserContext, { context: BrowserContext }> = async({ context }, use) => {
  authenticateUser(context);
  use(context);
};
