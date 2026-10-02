// SPDX-License-Identifier: LicenseRef-Blockscout

import { isEqual } from 'es-toolkit';
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

import { getVisibleColumnIds, parseColumnOverrides, serializeColumnOverrides, setColumnVisibility } from '../utils/column-overrides';
import { getAvailableColumns, getDefaultColumnIds } from '../utils/columns';

type CheckedColumns = Partial<Record<TokenTransferColumnId, boolean>>;

export interface TokenTransferColumnsState {
  readonly columns: ReadonlyArray<TokenTransferColumnId>;
  readonly selectableColumns: ReadonlyArray<TokenTransferColumn>;
  readonly checkedColumns: CheckedColumns;
  readonly isCustomized: boolean;
  readonly onColumnsChange: (checkedColumns: CheckedColumns) => void;
}

function readOverridesMap(serverCookies?: string): TokenTransferColumnOverridesMap {
  return parseColumnOverrides(cookies.get(cookies.NAMES.TOKEN_TRANSFER_COLUMNS, serverCookies));
}

export function useTokenTransferColumns(surface: TokenTransferSurface): TokenTransferColumnsState {
  const serverCookies = useAppContext().cookies;
  const [ overrides, setOverrides ] = React.useState<TokenTransferColumnOverrides | undefined>(
    () => readOverridesMap(serverCookies)[surface],
  );

  const selectableColumns = getAvailableColumns(surface);
  const columns = React.useMemo(() => getVisibleColumnIds(surface, overrides), [ surface, overrides ]);
  const checkedColumns = React.useMemo(() => Object.fromEntries(columns.map((id) => [ id, true ])), [ columns ]);
  const isCustomized = !isEqual(columns, getDefaultColumnIds(surface));

  const onColumnsChange = React.useCallback((nextCheckedColumns: CheckedColumns) => {
    const toggledColumns = selectableColumns.filter(({ id }) => Boolean(nextCheckedColumns[id]) !== columns.includes(id));
    if (toggledColumns.length === 0) {
      return;
    }

    const overridesMap = toggledColumns.reduce(
      (result, { id }) => setColumnVisibility(result, surface, id, Boolean(nextCheckedColumns[id])),
      readOverridesMap(),
    );
    cookies.set(cookies.NAMES.TOKEN_TRANSFER_COLUMNS, serializeColumnOverrides(overridesMap), { expires: 365 });
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

  return React.useMemo(() => ({
    columns,
    selectableColumns,
    checkedColumns,
    isCustomized,
    onColumnsChange,
  }), [ columns, selectableColumns, checkedColumns, isCustomized, onColumnsChange ]);
}
