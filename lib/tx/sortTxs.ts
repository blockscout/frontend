import type { Transaction } from 'types/api/transaction';
import type { Sort } from 'types/client/txs-sort';

import compareBns from 'lib/bigint/compareBns';

const sortTxs = (sorting?: Sort) => (tx1: Transaction, tx2: Transaction) => {
  switch (sorting) {
    case 'val-desc':
      return compareBns(tx1.value, tx2.value);
    case 'val-asc':
      return compareBns(tx2.value, tx1.value);
    case 'fee-desc':
      return compareBns(tx1.fee.value, tx2.fee.value);
    case 'fee-asc':
      return compareBns(tx2.fee.value, tx1.fee.value);
    default:
      return 0;
  }
};

export default sortTxs;
