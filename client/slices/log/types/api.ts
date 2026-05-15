// SPDX-License-Identifier: LicenseRef-Blockscout

import type { AddressParam } from 'client/slices/address/types/api';

export interface DecodedInput {
  method_call: string;
  method_id: string;
  parameters: Array<DecodedInputParams>;
}

export interface DecodedInputParams {
  name: string;
  type: string;
  value: string | Array<unknown> | Record<string, unknown>;
  indexed?: boolean;
}

export interface TransactionLog {
  address: AddressParam;
  topics: Array<string | null>;
  data: string;
  index: number;
  decoded: DecodedInput | null;
  transaction_hash: string | null;
  block_timestamp: string | null;
}

export interface LogsResponseTx {
  items: Array<TransactionLog>;
  next_page_params: {
    index: number;
    items_count: number;
    transaction_hash: string;
  } | null;
}

export interface LogsResponseAddress {
  items: Array<TransactionLog>;
  next_page_params: {
    index: number;
    items_count: number;
    transaction_index: number;
    block_number: number;
  } | null;
}
