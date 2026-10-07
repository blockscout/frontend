// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { TokenTransferColumn, TokenTransferSurface } from '../types/client';

import type { PersistedColumnsState, TableColumnsAnalytics } from 'src/shared/lists/columns/usePersistedColumns';
import { usePersistedColumns } from 'src/shared/lists/columns/usePersistedColumns';

import type { SurfaceColumnStatesParams } from '../utils/columns';
import { getSurfaceColumnStates, TOKEN_TRANSFER_COLUMNS } from '../utils/columns';

export type TokenTransferColumnsState = PersistedColumnsState<TokenTransferColumn>;

export function useTokenTransferColumns(
  surface: TokenTransferSurface,
  { chainConfig, typeFilter, tokenType }: SurfaceColumnStatesParams,
): TokenTransferColumnsState {
  const states = React.useMemo(
    () => getSurfaceColumnStates(surface, { chainConfig, typeFilter, tokenType }),
    [ surface, chainConfig, typeFilter, tokenType ],
  );
  const analytics = React.useMemo((): TableColumnsAnalytics => ({ Table: 'Token transfers', Surface: surface }), [ surface ]);

  return usePersistedColumns({
    storageKey: `table_columns_token_transfers_${ surface }`,
    columns: TOKEN_TRANSFER_COLUMNS,
    states,
    analytics,
  });
}
