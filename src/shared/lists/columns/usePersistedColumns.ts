// SPDX-License-Identifier: LicenseRef-Blockscout

import { isEqual } from 'es-toolkit';
import React from 'react';

import type { ColumnOverrides, ColumnStates, ColumnVisibility, TableColumn } from './types';

import type { EventPayload } from 'src/shared/analytics';
import { EventTypes, logEvent } from 'src/shared/analytics';

import {
  getAvailableColumns,
  getDefaultColumnIds,
  getOrderedColumns,
  getVisibleColumnIds,
  parseColumnOverrides,
  serializeColumnOverrides,
  setColumnOrder,
  setColumnVisibility,
} from './column-overrides';
import { readColumnStorage, subscribeToColumnStorage, writeColumnStorage } from './column-storage';

export type TableColumnsAnalytics = Omit<EventPayload<EventTypes.TABLE_COLUMNS>, 'Column' | 'State'>;

interface Params<TColumn extends TableColumn<TColumnId>, TColumnId extends string = TColumn['id']> {
  readonly storageKey: string;
  readonly columns: ReadonlyArray<TColumn>;
  readonly states: ColumnStates<NoInfer<TColumnId>>;
  readonly analytics: TableColumnsAnalytics;
}

export interface PersistedColumnsState<TColumn extends TableColumn<TColumnId>, TColumnId extends string = TColumn['id']> {
  readonly columns: ReadonlyArray<TColumnId>;
  readonly selectableColumns: ReadonlyArray<TColumn>;
  readonly checkedColumns: ColumnVisibility<TColumnId>;
  readonly isCustomized: boolean;
  readonly onColumnsChange: (checkedColumns: ColumnVisibility<TColumnId>) => void;
  readonly onColumnsReorder: (order: Array<TColumnId>, movedId: TColumnId) => void;
  readonly onColumnsReset: () => void;
}

const getServerSnapshot = (): string | null => null;

export function usePersistedColumns<TColumn extends TableColumn<TColumnId>, TColumnId extends string = TColumn['id']>({
  storageKey,
  columns,
  states,
  analytics,
}: Params<TColumn, TColumnId>): PersistedColumnsState<TColumn, TColumnId> {
  const subscribe = React.useCallback((listener: () => void) => subscribeToColumnStorage(storageKey, listener), [ storageKey ]);
  const getSnapshot = React.useCallback(() => readColumnStorage(storageKey), [ storageKey ]);
  const rawOverrides = React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const columnIds = React.useMemo(() => columns.map(({ id }) => id), [ columns ]);
  const overrides = React.useMemo(() => parseColumnOverrides(rawOverrides, columnIds), [ rawOverrides, columnIds ]);

  const availableColumns = React.useMemo(() => getAvailableColumns(columns, states), [ columns, states ]);
  const defaultColumnIds = React.useMemo(() => getDefaultColumnIds(columns, states), [ columns, states ]);
  const selectableColumns = React.useMemo(() => getOrderedColumns(availableColumns, overrides?.order), [ availableColumns, overrides ]);
  const visibleColumnIds = React.useMemo(() => getVisibleColumnIds(availableColumns, states, overrides), [ availableColumns, states, overrides ]);
  const checkedColumns = React.useMemo(
    () => Object.fromEntries(visibleColumnIds.map((id) => [ id, true ])) as ColumnVisibility<TColumnId>,
    [ visibleColumnIds ],
  );
  const isCustomized = !isEqual(visibleColumnIds, defaultColumnIds) || !isEqual(selectableColumns, availableColumns);

  const readOverrides = React.useCallback(
    () => parseColumnOverrides(readColumnStorage(storageKey), columnIds),
    [ storageKey, columnIds ],
  );
  const writeOverrides = React.useCallback((nextOverrides: ColumnOverrides<TColumnId> | undefined) => {
    writeColumnStorage(storageKey, nextOverrides ? serializeColumnOverrides(nextOverrides) : null);
  }, [ storageKey ]);

  const onColumnsChange = React.useCallback((nextCheckedColumns: ColumnVisibility<TColumnId>) => {
    const toggledColumns = selectableColumns.filter(({ id }) => Boolean(nextCheckedColumns[id]) !== visibleColumnIds.includes(id));
    if (toggledColumns.length === 0) {
      return;
    }

    writeOverrides(toggledColumns.reduce(
      (result, { id }) => setColumnVisibility(result, states, id, Boolean(nextCheckedColumns[id])),
      readOverrides(),
    ));

    toggledColumns.forEach(({ id }) => {
      logEvent(EventTypes.TABLE_COLUMNS, { ...analytics, Column: id, State: nextCheckedColumns[id] ? 'On' : 'Off' });
    });
  }, [ selectableColumns, visibleColumnIds, states, analytics, readOverrides, writeOverrides ]);

  const onColumnsReorder = React.useCallback((order: Array<TColumnId>, movedId: TColumnId) => {
    const fromIndex = selectableColumns.findIndex(({ id }) => id === movedId);
    const toIndex = order.indexOf(movedId);
    if (fromIndex === -1 || toIndex === -1 || fromIndex === toIndex) {
      return;
    }

    writeOverrides(setColumnOrder(readOverrides(), availableColumns, order));

    logEvent(EventTypes.TABLE_COLUMNS, { ...analytics, Column: movedId, State: toIndex < fromIndex ? 'Moved up' : 'Moved down' });
  }, [ selectableColumns, availableColumns, analytics, readOverrides, writeOverrides ]);

  const onColumnsReset = React.useCallback(() => {
    if (!isCustomized) {
      return;
    }

    writeOverrides(undefined);

    logEvent(EventTypes.TABLE_COLUMNS, { ...analytics, Column: 'All', State: 'Reset' });
  }, [ isCustomized, analytics, writeOverrides ]);

  return React.useMemo(() => ({
    columns: visibleColumnIds,
    selectableColumns,
    checkedColumns,
    isCustomized,
    onColumnsChange,
    onColumnsReorder,
    onColumnsReset,
  }), [ visibleColumnIds, selectableColumns, checkedColumns, isCustomized, onColumnsChange, onColumnsReorder, onColumnsReset ]);
}
