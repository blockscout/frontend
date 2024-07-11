import type { TestFixture, Page } from '@playwright/test';
import _isEqual from 'lodash/isEqual';
import type { PublicRpcSchema } from 'viem';

import { getEnvValue } from 'configs/app/utils';

type Params = PublicRpcSchema[number];

export type MockRpcResponseFixture = (params: Params) => Promise<void>;

// WIP
const fixture: TestFixture<MockRpcResponseFixture, { page: Page }> = async({ page }, use) => {
  await use(async({ Method, ReturnType }) => {
    const rpcUrl = getEnvValue('NEXT_PUBLIC_NETWORK_RPC_URL');

    if (!rpcUrl) {
      return;
    }

    await page.route(rpcUrl, (route) => {
      const method = route.request().method();

      if (method !== 'POST') {
        route.continue();
        return;
      }

      const json = route.request().postDataJSON();
      const id = json?.id;

      const payload = {
        id,
        jsonrpc: '2.0',
        method: Method,
        // TODO: add params to match actual payload
      };

      if (_isEqual(json, payload) && id !== undefined) {
        return route.fulfill({
          status: 200,
          body: JSON.stringify({
            id,
            jsonrpc: '2.0',
            result: ReturnType,
          }),
        });
      }
    });
  });
};

export default fixture;
