// SPDX-License-Identifier: LicenseRef-Blockscout

import { isEqual, omit } from 'es-toolkit';
import React from 'react';

import type {
  TokenTransferColumn,
  TokenTransferColumnId,
  TokenTransferColumnOverrides,
  TokenTransferColumnOverridesMap,
  TokenTransferSurface,
} from '../types/client';

import { useAppContext } from 'src/shell/app/context';

import * as mixpanel from 'src/services/mixpanel';
import * as cookies from 'src/shared/storage/cookies';

import {
  getOrderedColumns,
  getVisibleColumnIds,
  parseColumnOverrides,
  serializeColumnOverrides,
  setColumnOrder,
  setColumnVisibility,
} from '../utils/column-overrides';
import { getAvailableColumns, getDefaultColumnIds } from '../utils/columns';

type CheckedColumns = Partial<Record<TokenTransferColumnId, boolean>>;

export interface TokenTransferColumnsState {
  readonly columns: ReadonlyArray<TokenTransferColumnId>;
  readonly selectableColumns: ReadonlyArray<TokenTransferColumn>;
  readonly checkedColumns: CheckedColumns;
  readonly isCustomized: boolean;
  readonly onColumnsChange: (checkedColumns: CheckedColumns) => void;
  readonly onColumnsReorder: (order: Array<TokenTransferColumnId>, movedId: TokenTransferColumnId) => void;
  readonly onColumnsReset: () => void;
}

function readOverridesMap(serverCookies?: string): TokenTransferColumnOverridesMap {
  return parseColumnOverrides(cookies.get(cookies.NAMES.TOKEN_TRANSFER_COLUMNS, serverCookies));
}

function writeOverridesMap(overridesMap: TokenTransferColumnOverridesMap): void {
  cookies.set(cookies.NAMES.TOKEN_TRANSFER_COLUMNS, serializeColumnOverrides(overridesMap), { expires: 365 });
}

function isDefaultOrder(surface: TokenTransferSurface, columns: ReadonlyArray<TokenTransferColumn>): boolean {
  return isEqual(columns, getAvailableColumns(surface));
}

export function useTokenTransferColumns(surface: TokenTransferSurface): TokenTransferColumnsState {
  const serverCookies = useAppContext().cookies;
  const [ overrides, setOverrides ] = React.useState<TokenTransferColumnOverrides | undefined>(
    () => readOverridesMap(serverCookies)[surface],
  );

  const selectableColumns = React.useMemo(() => getOrderedColumns(surface, overrides?.order), [ surface, overrides ]);
  const columns = React.useMemo(() => getVisibleColumnIds(surface, overrides), [ surface, overrides ]);
  const checkedColumns = React.useMemo(() => Object.fromEntries(columns.map((id) => [ id, true ])), [ columns ]);
  const isCustomized = !isEqual(columns, getDefaultColumnIds(surface)) || !isDefaultOrder(surface, selectableColumns);

  const onColumnsChange = React.useCallback((nextCheckedColumns: CheckedColumns) => {
    const toggledColumns = selectableColumns.filter(({ id }) => Boolean(nextCheckedColumns[id]) !== columns.includes(id));
    if (toggledColumns.length === 0) {
      return;
    }

    const overridesMap = toggledColumns.reduce(
      (result, { id }) => setColumnVisibility(result, surface, id, Boolean(nextCheckedColumns[id])),
      readOverridesMap(),
    );
    writeOverridesMap(overridesMap);
    setOverrides(overridesMap[surface]);

    toggledColumns.forEach(({ id, name }) => {
      mixpanel.logEvent(mixpanel.EventTypes.TABLE_COLUMNS, {
        Table: 'Token transfers',
        Surface: surface,
        Column: name,
        State: nextCheckedColumns[id] ? 'On' : 'Off',
      });
    });
  }, [ surface, selectableColumns, columns ]);

  const onColumnsReorder = React.useCallback((order: Array<TokenTransferColumnId>, movedId: TokenTransferColumnId) => {
    const movedColumn = selectableColumns.find(({ id }) => id === movedId);
    const fromIndex = selectableColumns.findIndex(({ id }) => id === movedId);
    const toIndex = order.indexOf(movedId);
    if (!movedColumn || toIndex === -1 || fromIndex === toIndex) {
      return;
    }

    const overridesMap = setColumnOrder(readOverridesMap(), surface, order);
    writeOverridesMap(overridesMap);
    setOverrides(overridesMap[surface]);

    mixpanel.logEvent(mixpanel.EventTypes.TABLE_COLUMNS, {
      Table: 'Token transfers',
      Surface: surface,
      Column: movedColumn.name,
      State: toIndex < fromIndex ? 'Moved up' : 'Moved down',
    });
  }, [ surface, selectableColumns ]);

  const onColumnsReset = React.useCallback(() => {
    if (!isCustomized) {
      return;
    }

    const overridesMap = omit(readOverridesMap(), [ surface ]);
    writeOverridesMap(overridesMap);
    setOverrides(undefined);

    mixpanel.logEvent(mixpanel.EventTypes.TABLE_COLUMNS, {
      Table: 'Token transfers',
      Surface: surface,
      Column: 'All',
      State: 'Reset',
    });
  }, [ surface, isCustomized ]);

  return React.useMemo(() => ({
    columns,
    selectableColumns,
    checkedColumns,
    isCustomized,
    onColumnsChange,
    onColumnsReorder,
    onColumnsReset,
  }), [ columns, selectableColumns, checkedColumns, isCustomized, onColumnsChange, onColumnsReorder, onColumnsReset ]);
}
