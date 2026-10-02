// SPDX-License-Identifier: LicenseRef-Blockscout
// @vitest-environment jsdom

import mixpanel from 'mixpanel-browser';

import type { TokenTransferSurface } from '../types/client';

import { afterEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, renderHook } from 'vitest/lib';
import withEnvs from 'vitest/utils/mockEnvs';

vi.mock('mixpanel-browser', () => ({ 'default': { init: vi.fn(), track: vi.fn() } }));

const COOKIE_NAME = 'token_transfer_columns';

const setCookie = (value: unknown) => {
  document.cookie = `${ COOKIE_NAME }=${ encodeURIComponent(JSON.stringify(value)) }; path=/`;
};

const withMixpanel = (run: () => Promise<void>) => withEnvs([ [ 'NEXT_PUBLIC_MIXPANEL_PROJECT_TOKEN', 'test-mixpanel' ] ], run);

const renderColumnsHook = async(surface: TokenTransferSurface) => {
  const { init } = await import('src/services/mixpanel/queue');
  await init('test-mixpanel', {}, () => {});
  const { useTokenTransferColumns } = await import('./useTokenTransferColumns');
  return renderHook(() => useTokenTransferColumns(surface));
};

afterEach(() => {
  cleanup();
  document.cookie = `${ COOKIE_NAME }=; Max-Age=0; path=/`;
  vi.clearAllMocks();
});

describe('useTokenTransferColumns', () => {
  it('shows the surface defaults and offers only its available columns when nothing is stored', async() => {
    await withMixpanel(async() => {
      const { result } = await renderColumnsHook('tx');

      expect(result.current.columns).toEqual([ 'type', 'transfer_type', 'from_to', 'token_id', 'amount', 'asset', 'value' ]);
      expect(result.current.selectableColumns.map(({ id }) => id)).toEqual(
        [ 'type', 'transfer_type', 'from_to', 'token_id', 'amount', 'asset', 'value' ],
      );
    });
  });

  it('offers off-by-default columns unchecked', async() => {
    await withMixpanel(async() => {
      const { result } = await renderColumnsHook('token');

      expect(result.current.selectableColumns.map(({ id }) => id)).toContain('block');
      expect(result.current.checkedColumns.block).toBeFalsy();
      expect(result.current.checkedColumns.tx_hash).toBe(true);
    });
  });

  it('starts from the stored selection on the first render', async() => {
    setCookie({ index: { block: false }, token: { block: true } });

    await withMixpanel(async() => {
      const { result } = await renderColumnsHook('index');

      expect(result.current.columns).not.toContain('block');
      expect(result.current.checkedColumns.block).toBeFalsy();
    });
  });

  it('updates the columns at once and restores them on the next visit', async() => {
    await withMixpanel(async() => {
      const { result, unmount } = await renderColumnsHook('index');

      act(() => {
        result.current.onColumnsChange({ ...result.current.checkedColumns, block: false });
      });
      expect(result.current.columns).not.toContain('block');
      unmount();

      const { result: nextVisit } = await renderColumnsHook('index');
      expect(nextVisit.current.columns).toEqual(
        [ 'tx_hash', 'type', 'transfer_type', 'method', 'timestamp', 'from_to', 'token_id', 'amount', 'asset', 'value' ],
      );
    });
  });

  it('keeps the selection stored for other surfaces', async() => {
    setCookie({ token: { block: true } });

    await withMixpanel(async() => {
      const { result, unmount } = await renderColumnsHook('index');
      act(() => {
        result.current.onColumnsChange({ ...result.current.checkedColumns, asset: false });
      });
      unmount();

      const { result: tokenSurface } = await renderColumnsHook('token');
      expect(tokenSurface.current.columns).toContain('block');
    });
  });

  it('forgets a column switched back to its default', async() => {
    setCookie({ index: { block: false } });

    await withMixpanel(async() => {
      const { result } = await renderColumnsHook('index');
      act(() => {
        result.current.onColumnsChange({ ...result.current.checkedColumns, block: true });
      });

      const { parseColumnOverrides } = await import('../utils/column-overrides');
      const { get, NAMES } = await import('src/shared/storage/cookies');
      expect(parseColumnOverrides(get(NAMES.TOKEN_TRANSFER_COLUMNS))).toEqual({});
    });
  });

  it('is not customized while the columns match the surface defaults', async() => {
    setCookie({ token: { block: true } });

    await withMixpanel(async() => {
      const { result } = await renderColumnsHook('index');

      expect(result.current.isCustomized).toBe(false);
    });
  });

  it('is customized once the columns deviate from the defaults, and not after switching back', async() => {
    await withMixpanel(async() => {
      const { result } = await renderColumnsHook('index');

      act(() => {
        result.current.onColumnsChange({ ...result.current.checkedColumns, block: false });
      });
      expect(result.current.isCustomized).toBe(true);

      act(() => {
        result.current.onColumnsChange({ ...result.current.checkedColumns, block: true });
      });
      expect(result.current.isCustomized).toBe(false);
    });
  });

  it('is not customized by a stored override that now matches the defaults', async() => {
    setCookie({ index: { block: true } });

    await withMixpanel(async() => {
      const { result } = await renderColumnsHook('index');

      expect(result.current.isCustomized).toBe(false);
    });
  });

  it('logs one event with the surface, the column and its new state per toggle', async() => {
    await withMixpanel(async() => {
      const { result } = await renderColumnsHook('token');
      act(() => {
        result.current.onColumnsChange({ ...result.current.checkedColumns, block: true });
      });

      expect(mixpanel.track).toHaveBeenCalledTimes(1);
      expect(mixpanel.track).toHaveBeenCalledWith(
        'Table columns',
        { Table: 'Token transfers', Surface: 'token', Column: 'Block', State: 'On' },
        undefined,
        undefined,
      );
    });
  });

  it('resets the columns to the surface defaults and keeps the selection stored for other surfaces', async() => {
    setCookie({ index: { block: false, asset: false }, token: { block: true } });

    await withMixpanel(async() => {
      const { result } = await renderColumnsHook('index');
      expect(result.current.isCustomized).toBe(true);

      act(() => {
        result.current.onColumnsReset();
      });

      const { getDefaultColumnIds } = await import('../utils/columns');
      expect(result.current.columns).toEqual(getDefaultColumnIds('index'));
      expect(result.current.isCustomized).toBe(false);

      const { parseColumnOverrides } = await import('../utils/column-overrides');
      const { get, NAMES } = await import('src/shared/storage/cookies');
      expect(parseColumnOverrides(get(NAMES.TOKEN_TRANSFER_COLUMNS))).toEqual({ token: { block: true } });
    });
  });

  it('logs one reset event for the whole surface', async() => {
    setCookie({ index: { block: false, asset: false } });

    await withMixpanel(async() => {
      const { result } = await renderColumnsHook('index');
      act(() => {
        result.current.onColumnsReset();
      });

      expect(mixpanel.track).toHaveBeenCalledTimes(1);
      expect(mixpanel.track).toHaveBeenCalledWith(
        'Table columns',
        { Table: 'Token transfers', Surface: 'index', Column: 'All', State: 'Reset' },
        undefined,
        undefined,
      );
    });
  });

  it('does nothing on reset while the columns match the defaults', async() => {
    setCookie({ index: { block: true } });

    await withMixpanel(async() => {
      const { result } = await renderColumnsHook('index');
      act(() => {
        result.current.onColumnsReset();
      });

      expect(mixpanel.track).not.toHaveBeenCalled();
    });
  });

  it('logs nothing when the selection does not change', async() => {
    await withMixpanel(async() => {
      const { result } = await renderColumnsHook('index');
      act(() => {
        result.current.onColumnsChange({ ...result.current.checkedColumns });
      });

      expect(mixpanel.track).not.toHaveBeenCalled();
    });
  });
});
