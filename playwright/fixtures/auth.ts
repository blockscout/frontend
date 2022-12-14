import type { BrowserContext } from '@playwright/test';

export default function authFixture(context: BrowserContext) {
  context.addCookies([ { name: '_explorer_key', value: 'foo', domain: 'localhost', path: '/' } ]);
}
