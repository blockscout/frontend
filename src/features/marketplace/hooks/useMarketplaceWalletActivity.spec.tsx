// SPDX-License-Identifier: LicenseRef-Blockscout
// @vitest-environment jsdom

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import mixpanel from 'mixpanel-browser';
import React from 'react';
import { http } from 'viem';
import { createConfig, mock, WagmiProvider } from 'wagmi';
import { connect } from 'wagmi/actions';
import { optimism } from 'wagmi/chains';

import { afterEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, renderHook, waitFor } from 'vitest/lib';
import withEnvs from 'vitest/utils/mockEnvs';

vi.mock('mixpanel-browser', () => ({ 'default': { init: vi.fn(), track: vi.fn() } }));

const ACCOUNT = '0x1111111111111111111111111111111111111111';
const RECIPIENT = '0x2222222222222222222222222222222222222222';
const TX_HASH = `0x${ 'ab'.repeat(32) }`;
const REWARDS_ORIGIN = 'https://rewards.test';
const REWARDS_TOKEN = 'test-rewards-token';
const ACTIVITY_TOKEN = 'test-activity-token';
const ENV_OVERRIDES: Array<[ string, string ]> = [
  [ 'NEXT_PUBLIC_REWARDS_SERVICE_API_HOST', REWARDS_ORIGIN ],
  [ 'NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID', 'test-project' ],
  [ 'NEXT_PUBLIC_RE_CAPTCHA_APP_SITE_KEY', 'test-captcha' ],
  [ 'NEXT_PUBLIC_MIXPANEL_PROJECT_TOKEN', 'test-mixpanel' ],
];

afterEach(() => {
  cleanup();
  document.cookie = 'rewards_api_token=; Max-Age=0; path=/';
  vi.clearAllMocks();
});

describe('marketplace transaction activity', () => {
  it.each([ 'success', 'rejection', 'rewards unavailable' ])('preserves wallet behavior and rewards for %s', async(outcome) => {
    await withEnvs(ENV_OVERRIDES, async() => {
      const { useMarketplaceWalletActivity } = await import('./useMarketplaceWalletActivity');
      const { RewardsContextProvider, useRewardsContext } = await import('src/features/rewards/context');
      const { getResourceKey } = await import('src/api/hooks/useApiQuery');
      const { init } = await import('src/services/mixpanel/queue');
      await init('test-mixpanel', {}, () => {});

      const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
      queryClient.setQueryData(getResourceKey('core:user_info'), { address_hash: ACCOUNT });
      queryClient.setQueryData(getResourceKey('rewards:user_check_activity_pass', { queryParams: { address: ACCOUNT } }), { is_valid: true });
      const walletConfig = createConfig({
        chains: [ optimism ],
        connectors: [ mock({ accounts: [ ACCOUNT ] }) ],
        transports: { [optimism.id]: http() },
        storage: null,
      });
      await connect(walletConfig, { connector: walletConfig.connectors[0] });
      const activityRequests: Array<{ path: string; body: unknown }> = [];
      fetchMock.resetMocks();
      fetchMock.mockResponse(async(request) => {
        const path = new URL(request.url).pathname;
        if (path.includes('/track/transaction')) {
          activityRequests.push({ path, body: JSON.parse(await request.text()) });
          if (outcome === 'rewards unavailable') {
            return { status: 503, body: '{}' };
          }
          return { body: JSON.stringify({ token: ACTIVITY_TOKEN }), headers: { 'content-type': 'application/json' } };
        }
        return { body: JSON.stringify({ is_valid: true }), headers: { 'content-type': 'application/json' } };
      });

      const WalletProvider = ({ children }: React.PropsWithChildren) => (
        <QueryClientProvider client={ queryClient }>
          <WagmiProvider config={ walletConfig } reconnectOnMount={ false }>
            <RewardsContextProvider>{ children }</RewardsContextProvider>
          </WagmiProvider>
        </QueryClientProvider>
      );
      const { result, unmount } = renderHook(() => ({
        activity: useMarketplaceWalletActivity('swap', true),
        rewards: useRewardsContext(),
      }), { wrapper: WalletProvider });
      act(() => result.current.rewards.onLoginSuccess(REWARDS_TOKEN));
      await waitFor(() => expect(result.current.rewards.isAuth).toBe(true));

      const send = outcome === 'rejection' ?
        async() => {
          throw new Error('Wallet rejected transaction');
        } :
        async() => TX_HASH;
      if (outcome === 'rejection') {
        await expect(result.current.activity.trackTransaction(RECIPIENT, send)).rejects.toThrow('Wallet rejected transaction');
      } else {
        expect(await result.current.activity.trackTransaction(RECIPIENT, send)).toBe(TX_HASH);
      }

      expect(activityRequests[0]).toEqual({
        path: '/api/v1/user/activity/track/transaction',
        body: { from_address: ACCOUNT, to_address: RECIPIENT, chain_id: '10' },
      });
      if (outcome === 'success') {
        expect(activityRequests[1]).toEqual({
          path: '/api/v1/activity/track/transaction/confirm',
          body: { tx_hash: TX_HASH, token: ACTIVITY_TOKEN },
        });
      } else {
        expect(activityRequests).toHaveLength(1);
      }
      if (outcome === 'rejection') {
        expect(mixpanel.track).not.toHaveBeenCalled();
      } else {
        expect(mixpanel.track).toHaveBeenCalledWith(expect.any(String), expect.objectContaining({
          Action: 'Send Transaction', Address: ACCOUNT, AppId: 'swap', Source: 'Essential dapps', ChainId: '10',
        }), undefined, undefined);
      }
      unmount();
      queryClient.clear();
    });
  });
});
