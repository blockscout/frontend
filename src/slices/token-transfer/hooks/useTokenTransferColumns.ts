// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { TokenTransferColumn, TokenTransferSurface } from '../types/client';

import type { PersistedColumnsState, TableColumnsAnalytics } from 'src/shared/lists/columns/usePersistedColumns';
import { usePersistedColumns } from 'src/shared/lists/columns/usePersistedColumns';

import { SURFACE_COLUMN_STATES, TOKEN_TRANSFER_COLUMNS } from '../utils/columns';

export type TokenTransferColumnsState = PersistedColumnsState<TokenTransferColumn>;

export function useTokenTransferColumns(surface: TokenTransferSurface): TokenTransferColumnsState {
  const analytics = React.useMemo((): TableColumnsAnalytics => ({ Table: 'Token transfers', Surface: surface }), [ surface ]);

  return usePersistedColumns({
    storageKey: `table_columns_token_transfers_${ surface }`,
    columns: TOKEN_TRANSFER_COLUMNS,
    states: SURFACE_COLUMN_STATES[surface],
    analytics,
  });
}
