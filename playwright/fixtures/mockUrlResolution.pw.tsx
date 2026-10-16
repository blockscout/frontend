/* eslint-disable react/jsx-filename-extension -- the runner only picks up *.pw.tsx; this test exercises the fixtures and mounts nothing */
import * as statsMock from 'src/slices/chain/stats/mocks';

import * as crossChainTxMock from 'src/features/cross-chain-txs/mocks/txs';

import { ENVS_MAP } from 'playwright/fixtures/mockEnvs';
import { test, expect } from 'playwright/lib';

const HOME_CHAIN_ID = '43114';
const API_HOST_OVERRIDE = 'localhost:4242';

test('mockApiResponse resolves the URL against the envs mocked for the test', async({ mockEnvs, mockApiResponse }) => {
  await mockEnvs([
    ...ENVS_MAP.crossChainTxs,
    [ 'NEXT_PUBLIC_NETWORK_ID', HOME_CHAIN_ID ],
    [ 'NEXT_PUBLIC_INTERCHAIN_INDEXER_API_HOST', `http://${ API_HOST_OVERRIDE }` ],
  ]);

  const url = new URL(await mockApiResponse('interchainIndexer:messages', crossChainTxMock.listResponse));

  expect(url.host).toBe(API_HOST_OVERRIDE);
  expect(url.searchParams.get('home_chain_id')).toBe(HOME_CHAIN_ID);
  expect(url.searchParams.has('bridge_ids')).toBe(false);
  expect(url.searchParams.get('include_unindexed_chains')).toBe('false');
});

test('mockEnvs after a registered mock fails the test', async({ mockEnvs, mockApiResponse }) => {
  await mockApiResponse('core:stats', statsMock.base);

  await expect(mockEnvs([ [ 'NEXT_PUBLIC_NETWORK_ID', HOME_CHAIN_ID ] ])).rejects.toThrow(
    /mockEnvs\(\) was called after mockApiResponse\(\).*Env overrides must come first/,
  );
});
