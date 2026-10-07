// SPDX-License-Identifier: LicenseRef-Blockscout
// @vitest-environment jsdom

import mixpanel from 'mixpanel-browser';
import React from 'react';
import { hydrateRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server';

import type { ColumnStates } from './types';

import { afterEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, renderHook } from 'vitest/lib';
import withEnvs from 'vitest/utils/mockEnvs';

import type { TableColumnsAnalytics } from './usePersistedColumns';

vi.mock('mixpanel-browser', () => ({ 'default': { init: vi.fn(), track: vi.fn() } }));

type ColumnId = 'hash' | 'block' | 'from' | 'amount' | 'fee';

const STORAGE_KEY = 'table_columns_test';

const COLUMNS = [
  { id: 'hash' as const, name: 'Hash' },
  { id: 'block' as const, name: 'Block' },
  { id: 'from' as const, name: 'From' },
  { id: 'amount' as const, name: 'Amount' },
  { id: 'fee' as const, name: 'Fee' },
];

const STATES: ColumnStates<ColumnId> = { hash: 'on', block: 'off', from: 'on', amount: 'on', fee: 'unavailable' };

const TABLE_ANALYTICS: TableColumnsAnalytics = { Table: 'Advanced filter' };
const SURFACE_ANALYTICS: TableColumnsAnalytics = { Table: 'Token transfers', Surface: 'index' };

const store = (value: unknown) => {
  window.localStorage.setItem(STORAGE_KEY, typeof value === 'string' ? value : JSON.stringify(value));
};

const readStored = () => window.localStorage.getItem(STORAGE_KEY);

const withMixpanel = (run: () => Promise<void>) => withEnvs([ [ 'NEXT_PUBLIC_MIXPANEL_PROJECT_TOKEN', 'test-mixpanel' ] ], run);

const importHook = async() => {
  const { init } = await import('src/services/mixpanel/queue');
  await init('test-mixpanel', {}, () => {});
  return (await import('./usePersistedColumns')).usePersistedColumns;
};

const renderColumnsHook = async(analytics: TableColumnsAnalytics = TABLE_ANALYTICS) => {
  const usePersistedColumns = await importHook();
  return renderHook(() => usePersistedColumns({ storageKey: STORAGE_KEY, columns: COLUMNS, states: STATES, analytics }));
};

const renderColumnsProbe = async() => {
  const usePersistedColumns = await importHook();
  const ColumnsProbe = () => {
    const { columns } = usePersistedColumns({ storageKey: STORAGE_KEY, columns: COLUMNS, states: STATES, analytics: TABLE_ANALYTICS });
    return <div data-testid="columns">{ columns.join(',') }</div>;
  };
  return ColumnsProbe;
};

afterEach(() => {
  cleanup();
  window.localStorage.clear();
  vi.restoreAllMocks();
  vi.clearAllMocks();
});

describe('usePersistedColumns', () => {
  it('shows the defaults and offers only the available columns when nothing is stored', async() => {
    await withMixpanel(async() => {
      const { result } = await renderColumnsHook();

      expect(result.current.columns).toEqual([ 'hash', 'from', 'amount' ]);
      expect(result.current.selectableColumns.map(({ id }) => id)).toEqual([ 'hash', 'block', 'from', 'amount' ]);
      expect(result.current.checkedColumns).toEqual({ hash: true, from: true, amount: true });
      expect(result.current.isCustomized).toBe(false);
    });
  });

  it('renders the defaults on the server whatever is stored', async() => {
    store({ visibility: { hash: false }, order: [ 'amount', 'hash', 'block', 'from' ] });

    await withMixpanel(async() => {
      const ColumnsProbe = await renderColumnsProbe();

      expect(renderToString(<ColumnsProbe/>)).toContain('hash,from,amount');
    });
  });

  it('hydrates the server markup without a warning and switches to the stored columns', async() => {
    store({ visibility: { hash: false }, order: [ 'amount', 'hash', 'block', 'from' ] });
    const consoleError = vi.spyOn(console, 'error');

    await withMixpanel(async() => {
      const ColumnsProbe = await renderColumnsProbe();
      const container = document.createElement('div');
      container.innerHTML = renderToString(<ColumnsProbe/>);
      document.body.appendChild(container);

      const root = await act(async() => hydrateRoot(container, <ColumnsProbe/>, { onRecoverableError: consoleError }));

      expect(container.textContent).toBe('amount,from');
      expect(consoleError).not.toHaveBeenCalled();
      act(() => root.unmount());
      container.remove();
    });
  });

  it('starts from the stored columns on the first client render', async() => {
    store({ visibility: { block: true }, order: [ 'amount', 'block', 'hash', 'from' ] });

    await withMixpanel(async() => {
      const { result } = await renderColumnsHook();

      expect(result.current.columns).toEqual([ 'amount', 'block', 'hash', 'from' ]);
      expect(result.current.isCustomized).toBe(true);
    });
  });

  it('reads invalid JSON as no overrides', async() => {
    store('{not json');

    await withMixpanel(async() => {
      const { result } = await renderColumnsHook();

      expect(result.current.columns).toEqual([ 'hash', 'from', 'amount' ]);
      expect(result.current.isCustomized).toBe(false);
    });
  });

  it('stores a toggle and shows it in every table using the same key', async() => {
    await withMixpanel(async() => {
      const { result } = await renderColumnsHook();
      const { result: otherTable } = await renderColumnsHook();

      act(() => {
        result.current.onColumnsChange({ ...result.current.checkedColumns, block: true });
      });

      expect(result.current.columns).toEqual([ 'hash', 'block', 'from', 'amount' ]);
      expect(otherTable.current.columns).toEqual([ 'hash', 'block', 'from', 'amount' ]);
      expect(JSON.parse(readStored() ?? '')).toEqual({ visibility: { block: true } });
    });
  });

  it('applies a change made in another tab', async() => {
    await withMixpanel(async() => {
      const { result } = await renderColumnsHook();

      act(() => {
        store({ visibility: { from: false } });
        window.dispatchEvent(new StorageEvent('storage', { key: STORAGE_KEY }));
      });

      expect(result.current.columns).toEqual([ 'hash', 'amount' ]);
    });
  });

  it('removes the key once the columns are switched back to the defaults', async() => {
    store({ visibility: { block: true } });

    await withMixpanel(async() => {
      const { result } = await renderColumnsHook();
      act(() => {
        result.current.onColumnsChange({ ...result.current.checkedColumns, block: false });
      });

      expect(readStored()).toBeNull();
      expect(result.current.isCustomized).toBe(false);
    });
  });

  it('moves a column and stores the full order', async() => {
    await withMixpanel(async() => {
      const { result } = await renderColumnsHook();
      act(() => {
        result.current.onColumnsReorder([ 'amount', 'hash', 'block', 'from' ], 'amount');
      });

      expect(result.current.columns).toEqual([ 'amount', 'hash', 'from' ]);
      expect(result.current.selectableColumns.map(({ id }) => id)).toEqual([ 'amount', 'hash', 'block', 'from' ]);
      expect(JSON.parse(readStored() ?? '')).toEqual({ order: [ 'amount', 'hash', 'block', 'from' ] });
      expect(result.current.isCustomized).toBe(true);
    });
  });

  it('neither logs nor stores a move that leaves the column in place', async() => {
    await withMixpanel(async() => {
      const { result } = await renderColumnsHook();
      act(() => {
        result.current.onColumnsReorder([ 'hash', 'block', 'from', 'amount' ], 'from');
      });

      expect(readStored()).toBeNull();
      expect(mixpanel.track).not.toHaveBeenCalled();
    });
  });

  it('resets by removing the key', async() => {
    store({ visibility: { hash: false }, order: [ 'amount', 'hash', 'block', 'from' ] });

    await withMixpanel(async() => {
      const { result } = await renderColumnsHook();
      act(() => {
        result.current.onColumnsReset();
      });

      expect(readStored()).toBeNull();
      expect(result.current.columns).toEqual([ 'hash', 'from', 'amount' ]);
      expect(result.current.isCustomized).toBe(false);
    });
  });

  it('does nothing on reset while the columns match the defaults', async() => {
    store({ visibility: { hash: true } });

    await withMixpanel(async() => {
      const { result } = await renderColumnsHook();
      act(() => {
        result.current.onColumnsReset();
      });

      expect(readStored()).not.toBeNull();
      expect(mixpanel.track).not.toHaveBeenCalled();
    });
  });

  it('keeps working within the session when storage throws', async() => {
    await withMixpanel(async() => {
      const usePersistedColumns = await importHook();
      vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
        throw new DOMException('denied', 'SecurityError');
      });
      vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new DOMException('denied', 'SecurityError');
      });

      const { result } = renderHook(() => usePersistedColumns({ storageKey: STORAGE_KEY, columns: COLUMNS, states: STATES, analytics: TABLE_ANALYTICS }));
      expect(result.current.columns).toEqual([ 'hash', 'from', 'amount' ]);

      act(() => {
        result.current.onColumnsChange({ ...result.current.checkedColumns, hash: false });
      });
      expect(result.current.columns).toEqual([ 'from', 'amount' ]);

      act(() => {
        result.current.onColumnsReorder([ 'amount', 'hash', 'block', 'from' ], 'amount');
      });
      expect(result.current.columns).toEqual([ 'amount', 'from' ]);
    });
  });

  it('logs one event per toggled column with the column id and the table only', async() => {
    await withMixpanel(async() => {
      const { result } = await renderColumnsHook();
      act(() => {
        result.current.onColumnsChange({ hash: true, block: true, amount: true });
      });

      expect(mixpanel.track).toHaveBeenCalledTimes(2);
      expect(mixpanel.track).toHaveBeenNthCalledWith(1, 'Table columns', { Table: 'Advanced filter', Column: 'block', State: 'On' }, undefined, undefined);
      expect(mixpanel.track).toHaveBeenNthCalledWith(2, 'Table columns', { Table: 'Advanced filter', Column: 'from', State: 'Off' }, undefined, undefined);
    });
  });

  it('forwards the surface in the payload of every event', async() => {
    await withMixpanel(async() => {
      const { result } = await renderColumnsHook(SURFACE_ANALYTICS);
      act(() => {
        result.current.onColumnsReorder([ 'hash', 'block', 'amount', 'from' ], 'from');
      });
      act(() => {
        result.current.onColumnsReorder([ 'amount', 'hash', 'block', 'from' ], 'amount');
      });
      act(() => {
        result.current.onColumnsReset();
      });

      expect(mixpanel.track).toHaveBeenCalledTimes(3);
      expect(mixpanel.track).toHaveBeenNthCalledWith(
        1, 'Table columns', { Table: 'Token transfers', Surface: 'index', Column: 'from', State: 'Moved down' }, undefined, undefined,
      );
      expect(mixpanel.track).toHaveBeenNthCalledWith(
        2, 'Table columns', { Table: 'Token transfers', Surface: 'index', Column: 'amount', State: 'Moved up' }, undefined, undefined,
      );
      expect(mixpanel.track).toHaveBeenNthCalledWith(
        3, 'Table columns', { Table: 'Token transfers', Surface: 'index', Column: 'All', State: 'Reset' }, undefined, undefined,
      );
    });
  });

  it('logs nothing when the selection does not change', async() => {
    await withMixpanel(async() => {
      const { result } = await renderColumnsHook();
      act(() => {
        result.current.onColumnsChange({ ...result.current.checkedColumns });
      });

      expect(mixpanel.track).not.toHaveBeenCalled();
      expect(readStored()).toBeNull();
    });
  });
});
