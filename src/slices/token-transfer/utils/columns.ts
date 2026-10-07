// SPDX-License-Identifier: LicenseRef-Blockscout

import type { TokenTransferColumn, TokenTransferColumnId, TokenTransferSurface } from '../types/client';
import type { ColumnState, ColumnStates } from 'src/shared/lists/columns/types';
import type { TokenType } from 'src/slices/token/types/api';
import type { ChainConfig } from 'src/slices/token/types/client';

import { isTokenMultiplierEnabled, UI_MULTIPLIER_TOKEN_TYPE } from 'src/slices/token/utils/ui-multiplier';

export const TOKEN_TRANSFER_COLUMNS: ReadonlyArray<TokenTransferColumn> = [
  { id: 'in_out', name: 'In / Out', width: '70px' },
  { id: 'tx_hash', name: 'Txn hash', width: '135px' },
  { id: 'type', name: 'Token type', width: '95px' },
  { id: 'transfer_type', name: 'Transfer type', width: '145px' },
  { id: 'method', name: 'Method', width: '120px' },
  { id: 'timestamp', name: 'Timestamp', width: '170px' },
  { id: 'block', name: 'Block', width: '100px' },
  { id: 'from_to', name: 'From / To', width: '350px' },
  { id: 'multiplier', name: 'Multiplier', isNumeric: true, width: '90px' },
  { id: 'amount', name: 'Amount', isNumeric: true, width: '130px' },
  { id: 'asset', name: 'ID / Asset', width: '240px' },
  { id: 'value', name: 'Value', isNumeric: true, width: '120px' },
];

const SURFACE_COLUMN_STATES: Readonly<Record<TokenTransferSurface, ColumnStates<Exclude<TokenTransferColumnId, 'multiplier'>>>> = {
  index: {
    in_out: 'unavailable',
    tx_hash: 'on',
    type: 'on',
    transfer_type: 'on',
    method: 'on',
    timestamp: 'on',
    block: 'on',
    from_to: 'on',
    amount: 'on',
    asset: 'on',
    value: 'on',
  },
  address: {
    in_out: 'on',
    tx_hash: 'on',
    type: 'on',
    transfer_type: 'on',
    method: 'on',
    timestamp: 'on',
    block: 'on',
    from_to: 'on',
    amount: 'on',
    asset: 'on',
    value: 'on',
  },
  token: {
    in_out: 'unavailable',
    tx_hash: 'on',
    type: 'off',
    transfer_type: 'off',
    method: 'on',
    timestamp: 'on',
    block: 'off',
    from_to: 'on',
    amount: 'on',
    asset: 'on',
    value: 'on',
  },
  // the transaction endpoint returns method and timestamp as null, and the hash and block are the same for every row
  tx: {
    in_out: 'unavailable',
    tx_hash: 'unavailable',
    type: 'on',
    transfer_type: 'on',
    method: 'unavailable',
    timestamp: 'unavailable',
    block: 'unavailable',
    from_to: 'on',
    amount: 'on',
    asset: 'on',
    value: 'on',
  },
};

export interface SurfaceColumnStatesParams {
  readonly chainConfig?: ChainConfig;
  readonly typeFilter?: ReadonlyArray<TokenType>;
  readonly tokenType?: TokenType | null;
}

function getMultiplierState(surface: TokenTransferSurface, { chainConfig, typeFilter, tokenType }: SurfaceColumnStatesParams): ColumnState {
  if (!isTokenMultiplierEnabled(chainConfig)) {
    return 'unavailable';
  }

  if (typeFilter && typeFilter.length > 0 && !typeFilter.includes(UI_MULTIPLIER_TOKEN_TYPE)) {
    return 'unavailable';
  }

  if (surface === 'token' && tokenType !== UI_MULTIPLIER_TOKEN_TYPE) {
    return 'unavailable';
  }

  return 'on';
}

export function getSurfaceColumnStates(surface: TokenTransferSurface, params: SurfaceColumnStatesParams): ColumnStates<TokenTransferColumnId> {
  return { ...SURFACE_COLUMN_STATES[surface], multiplier: getMultiplierState(surface, params) };
}
