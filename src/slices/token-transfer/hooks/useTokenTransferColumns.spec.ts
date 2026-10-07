// SPDX-License-Identifier: LicenseRef-Blockscout
// @vitest-environment jsdom

import mixpanel from 'mixpanel-browser';

import type { TokenTransferSurface } from '../types/client';
import type { ClusterChainConfig } from 'src/features/multichain/types/client';

import { chainA } from 'src/features/multichain/mocks/chains';

import { afterEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, renderHook } from 'vitest/lib';
import withEnvs from 'vitest/utils/mockEnvs';

import type { SurfaceColumnStatesParams } from '../utils/columns';

vi.mock('mixpanel-browser', () => ({ 'default': { init: vi.fn(), track: vi.fn() } }));

const withMixpanel = (run: () => Promise<void>) => withEnvs([ [ 'NEXT_PUBLIC_MIXPANEL_PROJECT_TOKEN', 'test-mixpanel' ] ], run);

const chainWithoutErc8056 = chainA.app_config as ClusterChainConfig['app_config'];

const chainWithErc8056 = {
  ...chainWithoutErc8056,
  slices: {
    ...chainWithoutErc8056.slices,
    token: {
      ...chainWithoutErc8056.slices.token,
      additionalTypes: [ { id: 'ERC-8056', name: 'ERC-8056' } ],
    },
  },
} as ClusterChainConfig['app_config'];

const NO_PARAMS: SurfaceColumnStatesParams = {};
const ERC20_FILTER = [ 'ERC-20' ];

const renderColumnsHook = async(surface: TokenTransferSurface, params: SurfaceColumnStatesParams = NO_PARAMS) => {
  const { init } = await import('src/services/mixpanel/queue');
  await init('test-mixpanel', {}, () => {});
  const { useTokenTransferColumns } = await import('./useTokenTransferColumns');
  return renderHook((props: SurfaceColumnStatesParams) => useTokenTransferColumns(surface, props), { initialProps: params });
};

afterEach(() => {
  cleanup();
  window.localStorage.clear();
  vi.clearAllMocks();
});

describe('useTokenTransferColumns', () => {
  it('shows the surface defaults and offers only its available columns when nothing is stored', async() => {
    await withMixpanel(async() => {
      const { result } = await renderColumnsHook('tx');

      expect(result.current.columns).toEqual([ 'type', 'transfer_type', 'from_to', 'amount', 'asset', 'value' ]);
      expect(result.current.selectableColumns.map(({ id }) => id)).toEqual(
        [ 'type', 'transfer_type', 'from_to', 'amount', 'asset', 'value' ],
      );
    });
  });

  it('offers off-by-default columns unchecked', async() => {
    await withMixpanel(async() => {
      const { result } = await renderColumnsHook('token');

      expect(result.current.columns).toEqual([ 'tx_hash', 'method', 'timestamp', 'from_to', 'amount', 'asset', 'value' ]);
      expect(result.current.selectableColumns.map(({ id }) => id)).toContain('block');
      expect(result.current.checkedColumns.block).toBeFalsy();
    });
  });

  it('stores each surface under its own key', async() => {
    await withMixpanel(async() => {
      const { result } = await renderColumnsHook('index');
      act(() => {
        result.current.onColumnsChange({ ...result.current.checkedColumns, block: false });
      });

      expect(JSON.parse(window.localStorage.getItem('table_columns_token_transfers_index') ?? '')).toEqual({ visibility: { block: false } });
    });
  });

  it('reads the setting of its own surface only', async() => {
    window.localStorage.setItem('table_columns_token_transfers_token', JSON.stringify({ visibility: { block: true } }));

    await withMixpanel(async() => {
      const { result: index } = await renderColumnsHook('index');
      const { result: address } = await renderColumnsHook('address');
      const { result: token } = await renderColumnsHook('token');

      expect(token.current.columns).toContain('block');
      expect(index.current.isCustomized).toBe(false);
      expect(address.current.isCustomized).toBe(false);
    });
  });

  it('logs the table and the surface with the column id', async() => {
    await withMixpanel(async() => {
      const { result } = await renderColumnsHook('token');
      act(() => {
        result.current.onColumnsChange({ ...result.current.checkedColumns, block: true });
      });

      expect(mixpanel.track).toHaveBeenCalledTimes(1);
      expect(mixpanel.track).toHaveBeenCalledWith(
        'Table columns',
        { Table: 'Token transfers', Surface: 'token', Column: 'block', State: 'On' },
        undefined,
        undefined,
      );
    });
  });

  it('shows the multiplier column before amount when the chain enables ERC-8056', async() => {
    await withMixpanel(async() => {
      const { result } = await renderColumnsHook('index', { chainConfig: chainWithErc8056 });

      expect(result.current.columns).toEqual(
        [ 'tx_hash', 'type', 'transfer_type', 'method', 'timestamp', 'block', 'from_to', 'multiplier', 'amount', 'asset', 'value' ],
      );
    });
  });

  it('drops the multiplier column from the table and the selector under a type filter without ERC-8056', async() => {
    await withMixpanel(async() => {
      const { result, rerender } = await renderColumnsHook('address', { chainConfig: chainWithErc8056 });
      rerender({ chainConfig: chainWithErc8056, typeFilter: ERC20_FILTER });

      expect(result.current.columns).not.toContain('multiplier');
      expect(result.current.selectableColumns.map(({ id }) => id)).not.toContain('multiplier');
    });
  });

  it('keeps the multiplier column hidden after it is filtered out and back', async() => {
    await withMixpanel(async() => {
      const { result, rerender } = await renderColumnsHook('address', { chainConfig: chainWithErc8056 });
      act(() => {
        result.current.onColumnsChange({ ...result.current.checkedColumns, multiplier: false });
      });
      rerender({ chainConfig: chainWithErc8056, typeFilter: ERC20_FILTER });
      rerender({ chainConfig: chainWithErc8056 });

      expect(result.current.columns).not.toContain('multiplier');
      expect(result.current.checkedColumns.multiplier).toBeFalsy();
      expect(result.current.selectableColumns.map(({ id }) => id)).toContain('multiplier');
    });
  });

  it('brings the multiplier column back before amount after another column moved while it was filtered out', async() => {
    await withMixpanel(async() => {
      const { result, rerender } = await renderColumnsHook('tx', { chainConfig: chainWithErc8056, typeFilter: ERC20_FILTER });
      act(() => {
        result.current.onColumnsReorder([ 'value', 'type', 'transfer_type', 'from_to', 'amount', 'asset' ], 'value');
      });
      rerender({ chainConfig: chainWithErc8056 });

      expect(result.current.columns).toEqual([ 'value', 'type', 'transfer_type', 'from_to', 'multiplier', 'amount', 'asset' ]);
    });
  });

  it('offers the multiplier column on the token surface only for an ERC-8056 token', async() => {
    await withMixpanel(async() => {
      const { result: erc8056 } = await renderColumnsHook('token', { chainConfig: chainWithErc8056, tokenType: 'ERC-8056' });
      const { result: erc20 } = await renderColumnsHook('token', { chainConfig: chainWithErc8056, tokenType: 'ERC-20' });

      expect(erc8056.current.columns).toContain('multiplier');
      expect(erc20.current.selectableColumns.map(({ id }) => id)).not.toContain('multiplier');
    });
  });
});
