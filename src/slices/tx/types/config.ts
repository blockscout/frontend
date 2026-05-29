// SPDX-License-Identifier: LicenseRef-Blockscout

export const TX_FIELDS_IDS = [
  'value',
  'fee_currency',
  'gas_price',
  'tx_fee',
  'gas_fees',
  'burnt_fees',
  'L1_status',
  'batch',
] as const;

export type TxFieldsId = (typeof TX_FIELDS_IDS)[number];

export const TX_ADDITIONAL_FIELDS_IDS = [
  'fee_per_gas',
  'set_max_gas_limit',
] as const;

export type TxAdditionalFieldsId = (typeof TX_ADDITIONAL_FIELDS_IDS)[number];

export const TX_VIEWS_IDS = [
  'pending_txs',
] as const;

export type TxViewId = (typeof TX_VIEWS_IDS)[number];
