import type { Transaction } from 'client/slices/tx/types/api';

export interface TransactionDataAvailability {
  blob_versioned_hashes?: Array<string>;
  blob_gas_used?: string;
  blob_gas_price?: string;
  burnt_blob_fee?: string;
  max_fee_per_blob_gas?: string;
}

export interface TransactionsResponseWithBlobs {
  items: Array<Transaction>;
  next_page_params: {
    block_number: number;
    index: number;
    items_count: number;
  } | null;
}

export type TxsWithBlobsFilters = {
  type: 'blob_transaction';
};

export interface BlockDataAvailability {
  blob_gas_price?: string;
  blob_gas_used?: string;
  burnt_blob_fees?: string;
  excess_blob_gas?: string;
  blob_transactions_count?: number;
}
