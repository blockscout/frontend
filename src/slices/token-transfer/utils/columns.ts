// SPDX-License-Identifier: LicenseRef-Blockscout

import { mapValues } from 'es-toolkit';

import type { TokenTransferColumn, TokenTransferColumnId, TokenTransferColumnState, TokenTransferSurface } from '../types/client';

export const TOKEN_TRANSFER_COLUMNS: ReadonlyArray<TokenTransferColumn> = [
  { id: 'tx_hash', name: 'Txn hash', width: '135px' },
  { id: 'type', name: 'Token type', width: '95px' },
  { id: 'transfer_type', name: 'Transfer type', width: '145px' },
  { id: 'method', name: 'Method', width: '120px' },
  { id: 'timestamp', name: 'Timestamp', width: '170px' },
  { id: 'block', name: 'Block', width: '100px' },
  { id: 'from_to', name: 'From / To', width: '350px' },
  { id: 'token_id', name: 'Token ID', width: '120px' },
  { id: 'amount', name: 'Amount', isNumeric: true, width: '180px' },
  { id: 'asset', name: 'Asset', width: '120px' },
  { id: 'value', name: 'Value', isNumeric: true, width: '120px' },
];

type SurfaceColumnStates = Readonly<Record<TokenTransferColumnId, TokenTransferColumnState>>;

export const SURFACE_COLUMN_STATES: Readonly<Record<TokenTransferSurface, SurfaceColumnStates>> = {
  index: {
    tx_hash: 'on',
    type: 'on',
    transfer_type: 'on',
    method: 'on',
    timestamp: 'on',
    block: 'on',
    from_to: 'on',
    token_id: 'on',
    amount: 'on',
    asset: 'on',
    value: 'on',
  },
  address: {
    tx_hash: 'on',
    type: 'on',
    transfer_type: 'on',
    method: 'on',
    timestamp: 'on',
    block: 'on',
    from_to: 'on',
    token_id: 'on',
    amount: 'on',
    asset: 'on',
    value: 'on',
  },
  token: {
    tx_hash: 'on',
    type: 'off',
    transfer_type: 'off',
    method: 'on',
    timestamp: 'on',
    block: 'off',
    from_to: 'on',
    token_id: 'on',
    amount: 'on',
    asset: 'unavailable',
    value: 'on',
  },
  // the transaction endpoint returns method and timestamp as null, and the hash and block are the same for every row
  tx: {
    tx_hash: 'unavailable',
    type: 'on',
    transfer_type: 'on',
    method: 'unavailable',
    timestamp: 'unavailable',
    block: 'unavailable',
    from_to: 'on',
    token_id: 'on',
    amount: 'on',
    asset: 'on',
    value: 'on',
  },
};

const AVAILABLE_COLUMNS = mapValues(
  SURFACE_COLUMN_STATES,
  (states) => TOKEN_TRANSFER_COLUMNS.filter((column) => states[column.id] !== 'unavailable'),
);

const DEFAULT_COLUMN_IDS = mapValues(
  SURFACE_COLUMN_STATES,
  (states) => TOKEN_TRANSFER_COLUMNS.filter((column) => states[column.id] === 'on').map((column) => column.id),
);

export function getAvailableColumns(surface: TokenTransferSurface): ReadonlyArray<TokenTransferColumn> {
  return AVAILABLE_COLUMNS[surface];
}

export function getDefaultColumnIds(surface: TokenTransferSurface): ReadonlyArray<TokenTransferColumnId> {
  return DEFAULT_COLUMN_IDS[surface];
}
