// SPDX-License-Identifier: LicenseRef-Blockscout

export type ColumnsIds = 'tx_hash' | 'type' | 'method' | 'age' | 'from' | 'or_and' | 'to' | 'amount' | 'asset' | 'fee';

export type TxTableColumn = {
  id: ColumnsIds;
  name: string;
  width: string;
  isNumeric?: boolean;
};
