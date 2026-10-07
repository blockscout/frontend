// SPDX-License-Identifier: LicenseRef-Blockscout
// @vitest-environment jsdom

import mixpanel from 'mixpanel-browser';

import type { TokenTransferSurface } from '../types/client';

import { afterEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, renderHook } from 'vitest/lib';
import withEnvs from 'vitest/utils/mockEnvs';

vi.mock('mixpanel-browser', () => ({ 'default': { init: vi.fn(), track: vi.fn() } }));

const withMixpanel = (run: () => Promise<void>) => withEnvs([ [ 'NEXT_PUBLIC_MIXPANEL_PROJECT_TOKEN', 'test-mixpanel' ] ], run);

const renderColumnsHook = async(surface: TokenTransferSurface) => {
  const { init } = await import('src/services/mixpanel/queue');
  await init('test-mixpanel', {}, () => {});
  const { useTokenTransferColumns } = await import('./useTokenTransferColumns');
  return renderHook(() => useTokenTransferColumns(surface));
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
});
