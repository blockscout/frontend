import type { BrowserContext } from '@playwright/test';

import * as cookies from 'lib/cookies';

export default function authFixture(context: BrowserContext) {
  context.addCookies([ { name: cookies.NAMES.API_TOKEN, value: 'foo', domain: 'localhost', path: '/' } ]);
}
