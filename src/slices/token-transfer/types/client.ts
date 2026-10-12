// SPDX-License-Identifier: LicenseRef-Blockscout

export type TokenTransferSurface = 'index' | 'address' | 'token' | 'tx';

export type TokenTransferColumnId =
  'in_out' |
  'tx_hash' |
  'type' |
  'transfer_type' |
  'method' |
  'timestamp' |
  'block' |
  'from_to' |
  'multiplier' |
  'amount' |
  'asset' |
  'value';

export interface TokenTransferColumn {
  readonly id: TokenTransferColumnId;
  readonly name: string;
  readonly isNumeric?: boolean;
  readonly width: string;
}
