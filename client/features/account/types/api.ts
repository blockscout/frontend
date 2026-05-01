import type { Transaction } from 'client/slices/tx/types/api';

export interface TransactionsResponseWatchlist {
  items: Array<Transaction>;
  next_page_params: {
    block_number: number;
    index: number;
    items_count: 50;
  } | null;
}
