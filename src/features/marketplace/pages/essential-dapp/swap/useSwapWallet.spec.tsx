// SPDX-License-Identifier: LicenseRef-Blockscout
// @vitest-environment jsdom

import { LiFiWidgetLight, type IframeEcosystemHandler } from '@lifi/widget-light';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import mixpanel from 'mixpanel-browser';
import React, { useMemo } from 'react';
import { http, UserRejectedRequestError, type EIP1193Parameters, type EIP1193Provider, type WalletRpcSchema } from 'viem';
import { createConfig, mock, WagmiProvider, type Config } from 'wagmi';
import { connect, disconnect } from 'wagmi/actions';
import { mainnet, optimism } from 'wagmi/chains';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, render, renderHook, waitFor } from 'vitest/lib';
import withEnvs from 'vitest/utils/mockEnvs';

vi.mock('mixpanel-browser', () => ({ 'default': { init: vi.fn(), track: vi.fn() } }));

const ACCOUNT = '0x1111111111111111111111111111111111111111';
const OTHER_ACCOUNT = '0x2222222222222222222222222222222222222222';
const TX_HASH = `0x${ 'ab'.repeat(32) }`;
const SIGNATURE = `0x${ 'cd'.repeat(65) }`;
const ETHEREUM_RPC = 'https://ethereum-rpc.test';
const OPTIMISM_RPC = 'https://optimism-rpc.test';
const WIDGET_ORIGIN = 'https://widget.li.fi';
const WIDGET_CONFIG = { integrator: 'blockscout' };
const BATCH_ID = 'wallet-batch-id';
const APPROVAL_HASH = `0x${ 'ef'.repeat(32) }`;
const REWARDS_ORIGIN = 'https://rewards.test';
const ACTIVITY_TOKEN = 'batch-activity-token';
const ENV_OVERRIDES: Array<[ string, string ]> = [
  [ 'NEXT_PUBLIC_REWARDS_SERVICE_API_HOST', REWARDS_ORIGIN ],
  [ 'NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID', 'test-project' ],
  [ 'NEXT_PUBLIC_RE_CAPTCHA_APP_SITE_KEY', 'test-captcha' ],
  [ 'NEXT_PUBLIC_MIXPANEL_PROJECT_TOKEN', 'test-mixpanel' ],
];
const BATCH_PARAMS = [ {
  chainId: '0x1', from: ACCOUNT, version: '2.0.0',
  calls: [ { to: ACCOUNT, data: '0x1234' }, { to: OTHER_ACCOUNT, data: '0x5678' } ],
} ];

interface BatchTestState {
  batchResult: unknown;
  status: unknown;
  reject: boolean;
}

async function renderTrackedSwap(): Promise<{
  readonly result: { readonly current: { readonly wallet: IframeEcosystemHandler } };
  readonly state: BatchTestState;
  readonly activityRequests: Array<{ path: string; body: unknown }>;
}> {
  const { useSwapWallet } = await import('./useSwapWallet');
  const { RewardsContextProvider, useRewardsContext } = await import('src/features/rewards/context');
  const { getResourceKey } = await import('src/api/hooks/useApiQuery');
  const { init } = await import('src/services/mixpanel/queue');
  await init('test-mixpanel', {}, () => {});
  queryClient.setQueryData(getResourceKey('core:user_info'), { address_hash: ACCOUNT });
  queryClient.setQueryData(getResourceKey('rewards:user_check_activity_pass', { queryParams: { address: ACCOUNT } }), { is_valid: true });

  const state: BatchTestState = { batchResult: { id: BATCH_ID }, status: { status: 100, receipts: [] }, reject: false };
  const connector = walletConfig.connectors[0];
  const getProvider = connector.getProvider.bind(connector);
  vi.spyOn(connector, 'getProvider').mockImplementation(async(options) => {
    const provider = await getProvider(options) as EIP1193Provider;
    const request = async(args: EIP1193Parameters<WalletRpcSchema>): Promise<unknown> => {
      if (args.method === 'wallet_sendCalls') {
        if (state.reject) {
          throw new UserRejectedRequestError(new Error('User rejected the batch.'));
        }
        return state.batchResult;
      }
      if (args.method === 'wallet_getCallsStatus') {
        return state.status;
      }
      return provider.request(args);
    };
    return { ...provider, request: request as typeof provider.request };
  });

  const activityRequests: Array<{ path: string; body: unknown }> = [];
  fetchMock.mockResponse(async(request) => {
    if (new URL(request.url).origin !== REWARDS_ORIGIN) {
      const { id, method } = JSON.parse(await request.text()) as { readonly id: number; readonly method: string };
      let result: unknown = [ ACCOUNT ];
      if (method === 'eth_sendTransaction') result = TX_HASH;
      if (method === 'eth_sign' || method === 'eth_signTypedData_v4') result = SIGNATURE;
      return JSON.stringify({ jsonrpc: '2.0', id, result });
    }
    const path = new URL(request.url).pathname;
    if (path.includes('/track/transaction')) {
      activityRequests.push({ path, body: JSON.parse(await request.text()) });
      return { body: JSON.stringify({ token: ACTIVITY_TOKEN }), headers: { 'content-type': 'application/json' } };
    }
    return { body: JSON.stringify({ is_valid: true }), headers: { 'content-type': 'application/json' } };
  });
  const TrackedWalletProvider = ({ children }: React.PropsWithChildren) => (
    <WalletProvider><RewardsContextProvider>{ children }</RewardsContextProvider></WalletProvider>
  );
  const { result } = renderHook(() => ({ wallet: useSwapWallet(), rewards: useRewardsContext() }), { wrapper: TrackedWalletProvider });
  act(() => result.current.rewards.onLoginSuccess('test-rewards-token'));
  await waitFor(() => expect(result.current.rewards.isAuth).toBe(true));
  return { result, state, activityRequests };
}

function createWalletConfig(): Config {
  return createConfig({
    chains: [
      { ...mainnet, rpcUrls: { 'default': { http: [ ETHEREUM_RPC ] } } },
      { ...optimism, rpcUrls: { 'default': { http: [ OPTIMISM_RPC ] } } },
    ],
    connectors: [ mock({ accounts: [ ACCOUNT ], features: { reconnect: true } }) ],
    transports: { [mainnet.id]: http(ETHEREUM_RPC), [optimism.id]: http(OPTIMISM_RPC) },
    syncConnectedChain: false,
    storage: null,
  });
}

let walletConfig: ReturnType<typeof createWalletConfig>;
let queryClient: QueryClient;
let rejectTransaction = false;
const sentTransactions: Array<unknown> = [];
const walletRpcUrls: Array<string> = [];

const WalletProvider = ({ children }: React.PropsWithChildren) => (
  <QueryClientProvider client={ queryClient }>
    <WagmiProvider config={ walletConfig } reconnectOnMount={ false }>{ children }</WagmiProvider>
  </QueryClientProvider>
);

beforeEach(async() => {
  walletConfig = createWalletConfig();
  queryClient = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } });
  rejectTransaction = false;
  sentTransactions.length = 0;
  walletRpcUrls.length = 0;
  fetchMock.resetMocks();
  fetchMock.mockResponse(async(request) => {
    const { id, method, params } = JSON.parse(await request.text()) as {
      readonly id: number;
      readonly method: string;
      readonly params: Array<unknown>;
    };
    let result: unknown;
    switch (method) {
      case 'eth_accounts': result = [ ACCOUNT ]; break;
      case 'eth_getBalance': result = new URL(request.url).origin === OPTIMISM_RPC ? '0x20' : '0x10'; break;
      case 'eth_sendTransaction':
        walletRpcUrls.push(request.url);
        if (rejectTransaction) {
          return JSON.stringify({ jsonrpc: '2.0', id, error: { code: 4001, message: 'User rejected the request.' } });
        }
        sentTransactions.push(params[0]);
        result = TX_HASH;
        break;
      case 'eth_sign':
      case 'eth_signTypedData_v4':
        walletRpcUrls.push(request.url);
        result = SIGNATURE;
        break;
      default: throw new Error(`Unexpected RPC: ${ method }`);
    }
    return JSON.stringify({ jsonrpc: '2.0', id, result });
  });
  await connect(walletConfig, { connector: walletConfig.connectors[0] });
});

afterEach(() => {
  cleanup();
  queryClient.clear();
  document.cookie = 'rewards_api_token=; Max-Age=0; path=/';
  vi.clearAllMocks();
  vi.restoreAllMocks();
});

describe('Swap wallet with wagmi v2', () => {
  it('exposes the existing connection and publishes account changes and disconnects', async() => {
    const { useSwapWallet } = await import('./useSwapWallet');
    const { result } = renderHook(useSwapWallet, { wrapper: WalletProvider });
    expect(result.current.getInitState()).toMatchObject({ chainType: 'EVM', state: { accounts: [ ACCOUNT ], chainId: mainnet.id } });
    const emit = vi.fn();
    const unsubscribe = result.current.subscribe(emit);

    act(() => walletConfig.connectors[0].onAccountsChanged([ OTHER_ACCOUNT ]));
    await waitFor(() => expect(emit).toHaveBeenCalledWith('accountsChanged', [ OTHER_ACCOUNT ]));
    await act(async() => {
      await disconnect(walletConfig);
    });
    expect(await result.current.handleRequest('accounts', 'eth_accounts')).toEqual([]);
    expect(emit).toHaveBeenCalledWith('accountsChanged', []);
    unsubscribe();
  });

  it('switches chains and reads from the connected chain even when the explorer stays on Ethereum', async() => {
    const { useSwapWallet } = await import('./useSwapWallet');
    const { result } = renderHook(useSwapWallet, { wrapper: WalletProvider });
    await act(async() => {
      await result.current.handleRequest('switch', 'wallet_switchEthereumChain', [ { chainId: '0xa' } ]);
    });
    expect(walletConfig.state.chainId).toBe(mainnet.id);
    await waitFor(() => expect(result.current.getInitState()).toMatchObject({ state: { chainId: optimism.id } }));
    expect(await result.current.handleRequest('balance', 'eth_getBalance', [ ACCOUNT, 'latest' ])).toBe('0x20');
    await waitFor(() => expect(queryClient.isFetching()).toBe(0));
    expect(await result.current.handleRequest('send', 'eth_sendTransaction', [ { to: OTHER_ACCOUNT, value: '0x0' } ])).toBe(TX_HASH);
  });

  it('can read the account and switch away from a wallet chain outside the configuration', async() => {
    const { useSwapWallet } = await import('./useSwapWallet');
    const { result } = renderHook(useSwapWallet, { wrapper: WalletProvider });
    act(() => walletConfig.connectors[0].onChainChanged('0x89'));

    expect(await result.current.handleRequest('chain', 'eth_chainId')).toBe('0x89');
    expect(await result.current.handleRequest('accounts', 'eth_accounts')).toEqual([ ACCOUNT ]);
    await act(async() => {
      expect(await result.current.handleRequest('switch', 'wallet_switchEthereumChain', [ { chainId: '0xa' } ])).toBeNull();
    });
    expect(await result.current.handleRequest('chain', 'eth_chainId')).toBe('0xa');
    expect(await result.current.handleRequest('balance', 'eth_getBalance', [ ACCOUNT, 'latest' ])).toBe('0x20');
  });

  it.each([
    { method: 'eth_sendTransaction', params: [ { to: OTHER_ACCOUNT, value: '0x0' } ], expected: TX_HASH },
    { method: 'personal_sign', params: [ '0x1234', ACCOUNT ], expected: SIGNATURE },
  ])('uses the new chain immediately after switching for $method', async({ method, params, expected }) => {
    const { useSwapWallet } = await import('./useSwapWallet');
    const { result } = renderHook(useSwapWallet, { wrapper: WalletProvider });
    await waitFor(() => expect(queryClient.isFetching()).toBe(0));
    const emit = vi.fn();
    result.current.subscribe(emit);
    await act(async() => {
      await result.current.handleRequest('switch', 'wallet_switchEthereumChain', [ { chainId: '0xa' } ]);
    });
    await waitFor(() => expect(emit).toHaveBeenCalledWith('chainChanged', '0xa'));

    expect(await result.current.handleRequest('after-switch', method, params)).toEqual(expected);
    expect(walletRpcUrls).toEqual([ `${ OPTIMISM_RPC }/` ]);
  });

  it('preserves transaction fields and returns wallet signatures', async() => {
    const { useSwapWallet } = await import('./useSwapWallet');
    const { result } = renderHook(useSwapWallet, { wrapper: WalletProvider });
    await waitFor(() => expect(queryClient.isFetching()).toBe(0));
    expect(await result.current.handleRequest('send', 'eth_sendTransaction', [ {
      to: OTHER_ACCOUNT, value: '0x123456789abcdef', gas: '0x5208', data: '0x1234',
    } ])).toBe(TX_HASH);
    expect(sentTransactions).toEqual([ expect.objectContaining({
      from: ACCOUNT, to: OTHER_ACCOUNT, value: '0x123456789abcdef', gas: '0x5208', data: '0x1234',
    }) ]);
    expect(await result.current.handleRequest('sign', 'personal_sign', [ '0x1234', ACCOUNT ])).toBe(SIGNATURE);
    expect(await result.current.handleRequest('typed', 'eth_signTypedData_v4', [ ACCOUNT, JSON.stringify({
      domain: { chainId: mainnet.id }, types: { Message: [ { name: 'value', type: 'string' } ] }, primaryType: 'Message', message: { value: 'test' },
    }) ])).toBe(SIGNATURE);
  });

  it('propagates a rejected transaction without reporting a successful send', async() => {
    const { useSwapWallet } = await import('./useSwapWallet');
    const { result } = renderHook(useSwapWallet, { wrapper: WalletProvider });
    await waitFor(() => expect(queryClient.isFetching()).toBe(0));
    rejectTransaction = true;
    await expect(result.current.handleRequest('send', 'eth_sendTransaction', [ { to: OTHER_ACCOUNT, value: '0x0' } ]))
      .rejects.toThrow('User rejected the request');
    expect(sentTransactions).toEqual([]);
  });

  it('bridges iframe requests and ignores messages from a different origin', async() => {
    const { useSwapWallet } = await import('./useSwapWallet');
    const Widget = () => {
      const handler = useSwapWallet();
      const handlers = useMemo(() => [ handler ], [ handler ]);
      return <LiFiWidgetLight config={ WIDGET_CONFIG } handlers={ handlers }/>;
    };
    const { container } = render(<WalletProvider><Widget/></WalletProvider>);
    const iframe = container.querySelector('iframe');
    expect(iframe?.src).toBe(`${ WIDGET_ORIGIN }/`);
    const frameWindow = iframe!.contentWindow!;
    const postMessage = vi.spyOn(frameWindow, 'postMessage');
    const dispatch = (origin: string) => window.dispatchEvent(new MessageEvent('message', {
      origin, source: frameWindow, data: { source: 'widget-light', type: 'READY' },
    }));
    act(() => {
      dispatch('https://untrusted.test');
    });
    expect(postMessage).not.toHaveBeenCalled();
    act(() => {
      dispatch(WIDGET_ORIGIN);
    });
    expect(postMessage).toHaveBeenCalledWith(expect.objectContaining({
      type: 'INIT', ecosystems: [ expect.objectContaining({ chainType: 'EVM', state: expect.objectContaining({ accounts: [ ACCOUNT ] }) }) ],
    }), WIDGET_ORIGIN);

    act(() => {
      window.dispatchEvent(new MessageEvent('message', {
        origin: WIDGET_ORIGIN, source: frameWindow,
        data: { source: 'widget-light', type: 'RPC_REQUEST', chainType: 'EVM', id: 'accounts', method: 'eth_accounts' },
      }));
    });
    await waitFor(() => expect(postMessage).toHaveBeenCalledWith(expect.objectContaining({
      type: 'RPC_RESPONSE', id: 'accounts', result: [ ACCOUNT ],
    }), WIDGET_ORIGIN));

    act(() => walletConfig.connectors[0].onAccountsChanged([ OTHER_ACCOUNT ]));
    await waitFor(() => expect(postMessage).toHaveBeenCalledWith(expect.objectContaining({
      type: 'EVENT', event: 'accountsChanged', data: [ OTHER_ACCOUNT ],
    }), WIDGET_ORIGIN));
  });
});

describe('Swap batch activity', () => {
  it.each([
    { name: 'atomic', batchResult: { id: BATCH_ID }, status: 200, hashes: [ TX_HASH ] },
    { name: 'multiple receipts', batchResult: { id: BATCH_ID }, status: 200, hashes: [ APPROVAL_HASH, TX_HASH ] },
    { name: 'legacy wallet response', batchResult: BATCH_ID, status: 'CONFIRMED', hashes: [ TX_HASH ] },
  ])('confirms the swap receipt once for $name', async({ batchResult, status, hashes }) => {
    await withEnvs(ENV_OVERRIDES, async() => {
      const { result, state, activityRequests } = await renderTrackedSwap();
      state.batchResult = batchResult;
      expect(await result.current.wallet.handleRequest('send-batch', 'wallet_sendCalls', BATCH_PARAMS)).toEqual(batchResult);
      expect(activityRequests).toEqual([ {
        path: '/api/v1/user/activity/track/transaction',
        body: { from_address: ACCOUNT, to_address: OTHER_ACCOUNT, chain_id: '1' },
      } ]);

      await result.current.wallet.handleRequest('pending', 'wallet_getCallsStatus', [ BATCH_ID ]);
      expect(activityRequests).toHaveLength(1);
      await act(async() => {
        await result.current.wallet.handleRequest('switch', 'wallet_switchEthereumChain', [ { chainId: '0xa' } ]);
      });
      state.status = { status, receipts: hashes.map((transactionHash) => ({ status: '0x1', transactionHash })) };
      const responses = await Promise.all([
        result.current.wallet.handleRequest('poll-1', 'wallet_getCallsStatus', [ BATCH_ID ]),
        result.current.wallet.handleRequest('poll-2', 'wallet_getCallsStatus', [ BATCH_ID ]),
      ]);
      expect(responses).toEqual([ state.status, state.status ]);
      await result.current.wallet.handleRequest('poll-3', 'wallet_getCallsStatus', [ BATCH_ID ]);
      expect(activityRequests).toHaveLength(2);
      expect(activityRequests[1]).toEqual({
        path: '/api/v1/activity/track/transaction/confirm', body: { tx_hash: TX_HASH, token: ACTIVITY_TOKEN },
      });
      expect(mixpanel.track).toHaveBeenCalledTimes(1);
      expect(mixpanel.track).toHaveBeenCalledWith(expect.any(String), expect.objectContaining({
        Action: 'Send Transaction', Address: ACCOUNT, AppId: 'swap', Source: 'Essential dapps', ChainId: '1',
      }), undefined, undefined);
    });
  });

  it('does not report a batch that the wallet rejects', async() => {
    await withEnvs(ENV_OVERRIDES, async() => {
      const { result, state, activityRequests } = await renderTrackedSwap();
      state.reject = true;
      await expect(result.current.wallet.handleRequest('reject-batch', 'wallet_sendCalls', BATCH_PARAMS)).rejects.toThrow('User rejected');
      state.status = { status: 200, receipts: [ { status: '0x1', transactionHash: TX_HASH } ] };
      await result.current.wallet.handleRequest('poll', 'wallet_getCallsStatus', [ BATCH_ID ]);
      expect(activityRequests).toHaveLength(1);
      expect(mixpanel.track).not.toHaveBeenCalled();
    });
  });

  it.each([
    { status: 300, receipts: [ { status: '0x1', transactionHash: TX_HASH } ] },
    { status: 400, receipts: [] },
    { status: 500, receipts: [ { status: '0x0', transactionHash: TX_HASH } ] },
    { status: 200, receipts: [ { status: '0x0', transactionHash: TX_HASH } ] },
    { status: 200, receipts: [ { status: '0x1', transactionHash: BATCH_ID } ] },
    { status: 200, receipts: [] },
  ])('does not confirm failed or missing transaction receipts: %j', async(response) => {
    await withEnvs(ENV_OVERRIDES, async() => {
      const { result, state, activityRequests } = await renderTrackedSwap();
      await result.current.wallet.handleRequest('send-batch', 'wallet_sendCalls', BATCH_PARAMS);
      state.status = response;
      await result.current.wallet.handleRequest('poll', 'wallet_getCallsStatus', [ BATCH_ID ]);
      expect(activityRequests).toHaveLength(1);
      expect(mixpanel.track).toHaveBeenCalledTimes(1);
    });
  });

  it.each([ [ {} ], [ { calls: [] } ] ])('forwards a batch without swap calls without tracking it: %j', async(params) => {
    await withEnvs(ENV_OVERRIDES, async() => {
      const { result, activityRequests } = await renderTrackedSwap();
      expect(await result.current.wallet.handleRequest('send-batch', 'wallet_sendCalls', params)).toEqual({ id: BATCH_ID });
      expect(activityRequests).toEqual([]);
      expect(mixpanel.track).not.toHaveBeenCalled();
    });
  });

  it('does not retain or log an invalid batch ID', async() => {
    await withEnvs(ENV_OVERRIDES, async() => {
      const { result, state, activityRequests } = await renderTrackedSwap();
      state.batchResult = 42;
      expect(await result.current.wallet.handleRequest('send-batch', 'wallet_sendCalls', BATCH_PARAMS)).toBe(42);
      expect(activityRequests).toHaveLength(1);
      expect(mixpanel.track).not.toHaveBeenCalled();
      state.status = { status: 200, receipts: [ { status: '0x1', transactionHash: TX_HASH } ] };
      await result.current.wallet.handleRequest('poll', 'wallet_getCallsStatus', [ BATCH_ID ]);
      expect(activityRequests).toHaveLength(1);
    });
  });

  it('ignores a status response without a valid batch ID', async() => {
    await withEnvs(ENV_OVERRIDES, async() => {
      const { result, state, activityRequests } = await renderTrackedSwap();
      await result.current.wallet.handleRequest('send-batch', 'wallet_sendCalls', BATCH_PARAMS);
      state.status = { status: 200, receipts: [ { status: '0x1', transactionHash: TX_HASH } ] };
      expect(await result.current.wallet.handleRequest('poll', 'wallet_getCallsStatus', { '0': BATCH_ID })).toEqual(state.status);
      expect(activityRequests).toHaveLength(1);
    });
  });

  it.each([ 100, 199, 'PENDING' ])('does not confirm an unfinished batch with status %s', async(status) => {
    await withEnvs(ENV_OVERRIDES, async() => {
      const { result, state, activityRequests } = await renderTrackedSwap();
      await result.current.wallet.handleRequest('send-batch', 'wallet_sendCalls', BATCH_PARAMS);
      state.status = { status, receipts: [ { status: '0x1', transactionHash: TX_HASH } ] };
      await result.current.wallet.handleRequest('poll', 'wallet_getCallsStatus', [ BATCH_ID ]);
      expect(activityRequests).toHaveLength(1);
      state.status = { status: 200, receipts: [ { status: '0x1', transactionHash: TX_HASH } ] };
      await result.current.wallet.handleRequest('confirmed', 'wallet_getCallsStatus', [ BATCH_ID ]);
      expect(activityRequests).toHaveLength(2);
    });
  });

  it('forgets a failed batch even if a later poll reports success', async() => {
    await withEnvs(ENV_OVERRIDES, async() => {
      const { result, state, activityRequests } = await renderTrackedSwap();
      await result.current.wallet.handleRequest('send-batch', 'wallet_sendCalls', BATCH_PARAMS);
      state.status = { status: 300, receipts: [ { status: '0x1', transactionHash: TX_HASH } ] };
      await result.current.wallet.handleRequest('failed', 'wallet_getCallsStatus', [ BATCH_ID ]);
      state.status = { status: 200, receipts: [ { status: '0x1', transactionHash: TX_HASH } ] };
      await result.current.wallet.handleRequest('later', 'wallet_getCallsStatus', [ BATCH_ID ]);
      expect(activityRequests).toHaveLength(1);
    });
  });

  it('requires every receipt to succeed before confirming the last swap hash', async() => {
    await withEnvs(ENV_OVERRIDES, async() => {
      const { result, state, activityRequests } = await renderTrackedSwap();
      await result.current.wallet.handleRequest('send-batch', 'wallet_sendCalls', BATCH_PARAMS);
      state.status = { status: 200, receipts: [
        { status: '0x0', transactionHash: APPROVAL_HASH },
        { status: '0x1', transactionHash: TX_HASH },
      ] };
      await result.current.wallet.handleRequest('poll', 'wallet_getCallsStatus', [ BATCH_ID ]);
      expect(activityRequests).toHaveLength(1);
    });
  });

  it('tracks a single transaction with its recipient and confirms its returned hash', async() => {
    await withEnvs(ENV_OVERRIDES, async() => {
      const { result, activityRequests } = await renderTrackedSwap();
      expect(await result.current.wallet.handleRequest('send', 'eth_sendTransaction', [ { to: OTHER_ACCOUNT, value: '0x1' } ])).toBe(TX_HASH);
      expect(activityRequests).toEqual([
        { path: '/api/v1/user/activity/track/transaction', body: { from_address: ACCOUNT, to_address: OTHER_ACCOUNT, chain_id: '1' } },
        { path: '/api/v1/activity/track/transaction/confirm', body: { tx_hash: TX_HASH, token: ACTIVITY_TOKEN } },
      ]);
      expect(mixpanel.track).toHaveBeenCalledWith(expect.any(String), expect.objectContaining({ Action: 'Send Transaction' }), undefined, undefined);
    });
  });

  it.each([
    { method: 'personal_sign', params: [ '0x1234', ACCOUNT ], action: 'Sign Message' },
    { method: 'eth_sign', params: [ ACCOUNT, '0x1234' ], action: 'Sign Message' },
    { method: 'eth_signTypedData_v4', params: [ ACCOUNT, JSON.stringify({
      domain: { chainId: mainnet.id }, types: { Message: [ { name: 'value', type: 'string' } ] },
      primaryType: 'Message', message: { value: 'test' },
    }) ], action: 'Sign Typed Data' },
  ])('logs $action for $method', async({ method, params, action }) => {
    await withEnvs(ENV_OVERRIDES, async() => {
      const { result } = await renderTrackedSwap();
      await result.current.wallet.handleRequest('sign', method, params);
      expect(mixpanel.track).toHaveBeenCalledWith(expect.any(String), expect.objectContaining({ Action: action }), undefined, undefined);
    });
  });
});
