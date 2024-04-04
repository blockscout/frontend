import type { BrowserContext } from '@playwright/test';

import * as cookies from 'lib/cookies';
import { domain } from 'playwright/utils/app';

/**
 * @deprecated please use storageState fixture
 *
 * @export
 * @param {BrowserContext} context
 */
export default function authFixture(context: BrowserContext) {
  context.addCookies([ { name: cookies.NAMES.API_TOKEN, value: 'foo', domain, path: '/' } ]);
}
