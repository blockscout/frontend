import type { TestFixture, Page } from '@playwright/test';
import _isEqual from 'lodash/isEqual';
import type { PublicRpcSchema } from 'viem';

import { getEnvValue } from 'configs/app/utils';

type Params = PublicRpcSchema[number];

export type MockRpcResponseFixture = (params: Params) => Promise<void>;

const fixture: TestFixture<MockRpcResponseFixture, { page: Page }> = async({ page }, use) => {
  await use(async(rpcMock) => {
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
        method: rpcMock.Method,
        ...(rpcMock.Parameters ? { params: rpcMock.Parameters } : {}),
      };

      if (_isEqual(json, payload) && id !== undefined) {
        return route.fulfill({
          status: 200,
          json: {
            id,
            jsonrpc: '2.0',
            result: rpcMock.ReturnType,
          },
        });
      }
    });
  });
};

export default fixture;
