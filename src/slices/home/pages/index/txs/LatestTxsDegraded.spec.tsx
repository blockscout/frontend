// @vitest-environment jsdom

import React from 'react';

import { rpcBlockWithTxsInfo } from 'src/slices/block/mocks/rpc';
import { HomeRpcDataContextProvider } from 'src/slices/home/contexts/rpc-data-context';
import { rpcTxReceipt } from 'src/slices/tx/mocks/rpc';

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup } from 'vitest/lib';
import { mockApiAndRpc } from 'vitest/utils/mockJsonRpc';

import LatestBlocksDegraded from '../blocks/LatestBlocksDegraded';
import LatestTxsDegraded from './LatestTxsDegraded';

const RPC_NODE = {
  eth_getBlockByNumber: rpcBlockWithTxsInfo,
  eth_getTransactionReceipt: { ...rpcTxReceipt, status: '0x1' },
};

const RPC_TX_HASH = '0xae5624c77f06d0164301380afa7780ebe49debe77eb3d5167004d69bd188a09f';
const EMPTY_MESSAGE = 'No latest transactions found.';

beforeEach(() => {
  fetchMock.resetMocks();
  mockApiAndRpc({ api: () => undefined, rpc: RPC_NODE });
});

afterEach(() => {
  cleanup();
});

describe('LatestTxsDegraded', () => {
  it('shows transactions from the RPC node when it is the only widget in degraded mode', async() => {
    render(
      <HomeRpcDataContextProvider>
        <LatestTxsDegraded maxNum={ 5 }/>
      </HomeRpcDataContextProvider>,
    );

    expect(await screen.findAllByText(RPC_TX_HASH)).not.toHaveLength(0);
    expect(screen.queryByText(EMPTY_MESSAGE)).toBeNull();
  });

  it('shows transactions from the RPC node under React strict mode', async() => {
    render(
      <React.StrictMode>
        <HomeRpcDataContextProvider>
          <LatestTxsDegraded maxNum={ 5 }/>
        </HomeRpcDataContextProvider>
      </React.StrictMode>,
    );

    expect(await screen.findAllByText(RPC_TX_HASH)).not.toHaveLength(0);
    expect(screen.queryByText(EMPTY_MESSAGE)).toBeNull();
  });

  it('never shows the empty message while waiting for the first block', async() => {
    render(
      <HomeRpcDataContextProvider>
        <LatestTxsDegraded maxNum={ 5 }/>
        <LatestBlocksDegraded maxNum={ 5 }/>
      </HomeRpcDataContextProvider>,
    );

    expect(screen.queryByText(EMPTY_MESSAGE)).toBeNull();
    await screen.findAllByText(RPC_TX_HASH);
    expect(screen.queryByText(EMPTY_MESSAGE)).toBeNull();
  });
});
