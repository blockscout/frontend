import type { TransactionsResponse } from 'types/api/transaction';
import type { Sort } from 'types/client/txs-sort';

import compareBns from 'lib/bigint/compareBns';

export default function sortTxs(txs: TransactionsResponse['items'], sorting?: Sort) {
  let sortedTxs;
  switch (sorting) {
    case 'val-desc':
      sortedTxs = [ ...txs ].sort((tx1, tx2) => compareBns(tx1.value, tx2.value));
      break;
    case 'val-asc':
      sortedTxs = [ ...txs ].sort((tx1, tx2) => compareBns(tx2.value, tx1.value));
      break;
    case 'fee-desc':
      sortedTxs = [ ...txs ].sort((tx1, tx2) => compareBns(tx1.fee.value, tx2.fee.value));
      break;
    case 'fee-asc':
      sortedTxs = [ ...txs ].sort((tx1, tx2) => compareBns(tx2.fee.value, tx1.fee.value));
      break;
    default:
      sortedTxs = txs;
  }

  return sortedTxs;
}
