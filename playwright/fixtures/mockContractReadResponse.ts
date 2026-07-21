import type { TestFixture, Page } from '@playwright/test';
import { isEqual } from 'es-toolkit';
import { encodeFunctionData, encodeFunctionResult, type AbiFunction } from 'viem';

import { getEnvValue } from 'src/config/utils/envs';

interface Params {
  abiItem: AbiFunction;
  args?: Array<unknown>;
  address: string;
  result: unknown;
  noResultEncoding?: boolean;
  rpcMethod?: string;
  times?: number;
}

export type MockContractReadResponseFixture = (params: Params) => Promise<void>;

const fixture: TestFixture<MockContractReadResponseFixture, { page: Page }> = async({ page }, use) => {
  await use(async({ abiItem, args = [], address, result, rpcMethod = 'eth_call', times = 1, noResultEncoding = false }) => {
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

      const dataJson = route.request().postDataJSON();
      const json = Array.isArray(dataJson) ? dataJson[0] : dataJson;
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

      if (isEqual(params, callParams) && id !== undefined && json?.method === rpcMethod) {

        const json = {
          id,
          jsonrpc: '2.0',
          result: noResultEncoding ? result : encodeFunctionResult({
            abi: [ abiItem ],
            functionName: abiItem.name,
            result: result as never,
          }),
        };

        return route.fulfill({
          status: 200,
          json: Array.isArray(dataJson) ? [ json ] : json,
        });
      }
    }, { times });
  });
};

export default fixture;
