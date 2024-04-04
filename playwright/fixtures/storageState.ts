import type { TestFixture, Page, BrowserContextOptions } from '@playwright/test';

import config from 'configs/app';
import { SECOND, YEAR } from 'lib/consts';
import * as cookies from 'lib/cookies';

export type StorageState = Exclude<BrowserContextOptions['storageState'], undefined>;

export const fixture: (items: Array<Item>) => TestFixture<StorageState, { page: Page }> = (items) => async({ }, use) => {
  const localStorage = items.filter(({ type }) => type === 'storage');
  const cookies = items.filter(({ type }) => type === 'cookie') as Array<ReturnType<typeof cookieMock>>;

  use({
    origins: [ { localStorage, origin: config.app.host ?? 'localhost' } ],
    cookies,
  });
};

type Item = ReturnType<typeof envMock> | ReturnType<typeof featureMock> | ReturnType<typeof cookieMock>;

export const envMock = (name: string, value: string) => ({ name, value, type: 'storage' as const });
export const featureMock = (name: string, value: unknown) => ({ name: `pw_feature:${ name }`, value: JSON.stringify(value), type: 'storage' as const });
export const cookieMock = (name: string, value: string) => ({
  name,
  value,
  domain: config.app.host ?? 'localhost',
  path: '/',
  expires: (Date.now() + YEAR) / SECOND,
  httpOnly: true,
  sameSite: 'None' as const,
  secure: true,
  type: 'cookie' as const,
});

export const COOKIES: Record<string, Array<ReturnType<typeof cookieMock>>> = {
  auth: [ cookieMock(cookies.NAMES.API_TOKEN, 'api-token') ],
};
