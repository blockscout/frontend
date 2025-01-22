import type { TestFixture, Page } from '@playwright/test';
import { isEqual } from 'es-toolkit';
import { encodeFunctionData, encodeFunctionResult, type AbiFunction } from 'viem';

import { getEnvValue } from 'configs/app/utils';

interface Params {
  abiItem: AbiFunction;
  args?: Array<unknown>;
  address: string;
  result: Array<unknown>;
}

export type MockContractReadResponseFixture = (params: Params) => Promise<void>;

const fixture: TestFixture<MockContractReadResponseFixture, { page: Page }> = async({ page }, use) => {
  await use(async({ abiItem, args = [], address, result }) => {
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
      const params = json?.params?.[0];
      const id = json?.id;

      const callParams = {
        data: encodeFunctionData({
          abi: [ abiItem ],
          functionName: abiItem.name,
          args,
        }),
        to: address,
        value: params?.value,
      };

      if (isEqual(params, callParams) && id) {
        return route.fulfill({
          status: 200,
          json: {
            id,
            jsonrpc: '2.0',
            result: encodeFunctionResult({
              abi: [ abiItem ],
              functionName: abiItem.name,
              result,
            }),
          },
        });
      }
    });
  });
};

export default fixture;
