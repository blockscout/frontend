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

      expect(result.current.columns).toEqual([ 'type', 'transfer_type', 'from_to', 'amount', 'asset', 'value' ]);
      expect(result.current.selectableColumns.map(({ id }) => id)).toEqual(
        [ 'type', 'transfer_type', 'from_to', 'amount', 'asset', 'value' ],
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
    setCookie({ index: { visibility: { block: false } }, token: { visibility: { block: true } } });

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
        [ 'tx_hash', 'type', 'transfer_type', 'method', 'timestamp', 'from_to', 'amount', 'asset', 'value' ],
      );
    });
  });

  it('keeps the selection stored for other surfaces', async() => {
    setCookie({ token: { visibility: { block: true } } });

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
    setCookie({ index: { visibility: { block: false } } });

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
    setCookie({ token: { visibility: { block: true } } });

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
    setCookie({ index: { visibility: { block: true } } });

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
    setCookie({ index: { visibility: { block: false, asset: false } }, token: { visibility: { block: true } } });

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
      expect(parseColumnOverrides(get(NAMES.TOKEN_TRANSFER_COLUMNS))).toEqual({ token: { visibility: { block: true } } });
    });
  });

  it('logs one reset event for the whole surface', async() => {
    setCookie({ index: { visibility: { block: false, asset: false } } });

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
    setCookie({ index: { visibility: { block: true } } });

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

  it('moves a column in the table and the selector, and restores the order on the next visit', async() => {
    await withMixpanel(async() => {
      const { result, unmount } = await renderColumnsHook('tx');

      act(() => {
        result.current.onColumnsReorder([ 'type', 'from_to', 'transfer_type', 'amount', 'asset', 'value' ], 'from_to');
      });
      expect(result.current.columns).toEqual([ 'type', 'from_to', 'transfer_type', 'amount', 'asset', 'value' ]);
      unmount();

      const { result: nextVisit } = await renderColumnsHook('tx');
      expect(nextVisit.current.columns).toEqual([ 'type', 'from_to', 'transfer_type', 'amount', 'asset', 'value' ]);
      expect(nextVisit.current.selectableColumns.map(({ id }) => id)).toEqual(
        [ 'type', 'from_to', 'transfer_type', 'amount', 'asset', 'value' ],
      );
    });
  });

  it('starts from the stored order on the first render', async() => {
    setCookie({ token: { visibility: { block: true }, order: [ 'block', 'value' ] } });

    await withMixpanel(async() => {
      const { result } = await renderColumnsHook('token');

      expect(result.current.columns).toEqual([ 'block', 'value', 'tx_hash', 'method', 'timestamp', 'from_to', 'amount', 'asset' ]);
    });
  });

  it('moves a hidden column in the selector without showing it', async() => {
    await withMixpanel(async() => {
      const { result } = await renderColumnsHook('token');

      act(() => {
        result.current.onColumnsReorder(
          [ 'block', 'tx_hash', 'type', 'transfer_type', 'method', 'timestamp', 'from_to', 'amount', 'asset', 'value' ],
          'block',
        );
      });

      expect(result.current.selectableColumns[0].id).toBe('block');
      expect(result.current.columns).toEqual([ 'tx_hash', 'method', 'timestamp', 'from_to', 'amount', 'asset', 'value' ]);
      expect(result.current.isCustomized).toBe(true);
    });
  });

  it('is customized by an order change alone', async() => {
    setCookie({ tx: { order: [ 'value' ] } });

    await withMixpanel(async() => {
      const { result } = await renderColumnsHook('tx');

      expect(result.current.checkedColumns).toEqual({ type: true, transfer_type: true, from_to: true, amount: true, asset: true, value: true });
      expect(result.current.isCustomized).toBe(true);
    });
  });

  it('is not customized by a stored order that now matches the defaults', async() => {
    setCookie({ tx: { order: [ 'type', 'transfer_type', 'from_to', 'amount', 'asset', 'value' ] } });

    await withMixpanel(async() => {
      const { result } = await renderColumnsHook('tx');

      expect(result.current.isCustomized).toBe(false);
    });
  });

  it('forgets the order once the columns are moved back to the default', async() => {
    setCookie({ tx: { order: [ 'value' ] } });

    await withMixpanel(async() => {
      const { result } = await renderColumnsHook('tx');
      act(() => {
        result.current.onColumnsReorder([ 'type', 'transfer_type', 'from_to', 'amount', 'asset', 'value' ], 'value');
      });

      expect(result.current.isCustomized).toBe(false);
      const { parseColumnOverrides } = await import('../utils/column-overrides');
      const { get, NAMES } = await import('src/shared/storage/cookies');
      expect(parseColumnOverrides(get(NAMES.TOKEN_TRANSFER_COLUMNS))).toEqual({});
    });
  });

  it('resets the order together with the visibility', async() => {
    setCookie({ tx: { visibility: { value: false }, order: [ 'value' ] } });

    await withMixpanel(async() => {
      const { result } = await renderColumnsHook('tx');
      act(() => {
        result.current.onColumnsReset();
      });

      expect(result.current.columns).toEqual([ 'type', 'transfer_type', 'from_to', 'amount', 'asset', 'value' ]);
      expect(result.current.selectableColumns.map(({ id }) => id)).toEqual(
        [ 'type', 'transfer_type', 'from_to', 'amount', 'asset', 'value' ],
      );
      expect(result.current.isCustomized).toBe(false);
    });
  });

  it('logs one event with the moved column and its direction per move', async() => {
    await withMixpanel(async() => {
      const { result } = await renderColumnsHook('tx');
      act(() => {
        result.current.onColumnsReorder([ 'type', 'transfer_type', 'amount', 'from_to', 'asset', 'value' ], 'from_to');
      });
      act(() => {
        result.current.onColumnsReorder([ 'value', 'type', 'transfer_type', 'amount', 'from_to', 'asset' ], 'value');
      });

      expect(mixpanel.track).toHaveBeenCalledTimes(2);
      expect(mixpanel.track).toHaveBeenNthCalledWith(
        1,
        'Table columns',
        { Table: 'Token transfers', Surface: 'tx', Column: 'From / To', State: 'Moved down' },
        undefined,
        undefined,
      );
      expect(mixpanel.track).toHaveBeenNthCalledWith(
        2,
        'Table columns',
        { Table: 'Token transfers', Surface: 'tx', Column: 'Value', State: 'Moved up' },
        undefined,
        undefined,
      );
    });
  });

  it('neither logs nor stores a move that leaves the column in place', async() => {
    await withMixpanel(async() => {
      const { result } = await renderColumnsHook('tx');
      act(() => {
        result.current.onColumnsReorder([ 'type', 'transfer_type', 'from_to', 'amount', 'asset', 'value' ], 'amount');
      });

      expect(mixpanel.track).not.toHaveBeenCalled();
      const { get, NAMES } = await import('src/shared/storage/cookies');
      expect(get(NAMES.TOKEN_TRANSFER_COLUMNS)).toBeUndefined();
    });
  });
});
