// SPDX-License-Identifier: LicenseRef-Blockscout

export type TokenTransferSurface = 'index' | 'address' | 'token' | 'tx';

export type TokenTransferColumnId =
  'tx_hash' |
  'type' |
  'transfer_type' |
  'method' |
  'timestamp' |
  'block' |
  'from_to' |
  'amount' |
  'asset' |
  'value';

export interface TokenTransferColumn {
  readonly id: TokenTransferColumnId;
  readonly name: string;
  readonly isNumeric?: boolean;
  readonly width: string;
}

export type TokenTransferColumnState = 'on' | 'off' | 'unavailable';

export type TokenTransferColumnVisibility = Partial<Record<TokenTransferColumnId, boolean>>;

export interface TokenTransferColumnOverrides {
  readonly visibility?: TokenTransferColumnVisibility;
  readonly order?: ReadonlyArray<TokenTransferColumnId>;
}

export type TokenTransferColumnOverridesMap = Partial<Record<TokenTransferSurface, TokenTransferColumnOverrides>>;
