/* eslint-disable max-len */
import type { TestFixture, Page, BrowserContextOptions } from '@playwright/test';

import config from 'configs/app';
import { SECOND, YEAR } from 'lib/consts';
import * as cookies from 'lib/cookies';

export type StorageState = Exclude<BrowserContextOptions['storageState'], undefined>;

export const fixture: (items: Array<Item>) => TestFixture<StorageState, { page: Page }> = (items) => async({ }, use) => {
  const localStorage = items.filter(({ type }) => type === 'storage');
  const cookies = items.filter(({ type }) => type === 'cookie') as Array<ReturnType<typeof addCookie>>;

  use({
    origins: [ { localStorage, origin: config.app.host ?? 'localhost' } ],
    cookies,
  });
};

type Item = ReturnType<typeof addEnv> | ReturnType<typeof addFeature> | ReturnType<typeof addCookie>;

export const addEnv = (name: string, value: string) => ({ name, value, type: 'storage' as const });
export const addFeature = (name: string, value: unknown) => ({ name: `pw_feature:${ name }`, value: JSON.stringify(value), type: 'storage' as const });
export const addCookie = (name: string, value: string) => ({
  name,
  value,
  domain: config.app.host ?? 'localhost',
  path: '/',
  expires: (Date.now() + YEAR) / SECOND,
  httpOnly: false,
  sameSite: 'Lax' as const,
  secure: false,
  type: 'cookie' as const,
});

export const COOKIES: Record<string, Array<ReturnType<typeof addCookie>>> = {
  auth: [ addCookie(cookies.NAMES.API_TOKEN, 'api-token') ],
};

export const ENVS: Record<string, Array<ReturnType<typeof addEnv>>> = {
  shibariumRollup: [
    addEnv('NEXT_PUBLIC_ROLLUP_TYPE', 'shibarium'),
    addEnv('NEXT_PUBLIC_ROLLUP_L1_BASE_URL', 'https://localhost:3101'),
  ],
  bridgedTokens: [
    addEnv('NEXT_PUBLIC_BRIDGED_TOKENS_CHAINS', '[{"id":"1","title":"Ethereum","short_title":"ETH","base_url":"https://eth.blockscout.com/token/"},{"id":"56","title":"Binance Smart Chain","short_title":"BSC","base_url":"https://bscscan.com/token/"},{"id":"99","title":"POA","short_title":"POA","base_url":"https://blockscout.com/poa/core/token/"}]'),
    addEnv('NEXT_PUBLIC_BRIDGED_TOKENS_BRIDGES', '[{"type":"omni","title":"OmniBridge","short_title":"OMNI"},{"type":"amb","title":"Arbitrary Message Bridge","short_title":"AMB"}]'),
  ],
  userOps: [
    addEnv('NEXT_PUBLIC_HAS_USER_OPS', 'true'),
  ],
};
