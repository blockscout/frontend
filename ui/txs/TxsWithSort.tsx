import { Box, Show } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';

import type { TransactionsResponse } from 'types/api/transaction';
import type { Sort } from 'types/client/txs-sort';

import compareBns from 'lib/bigint/compareBns';

import TxsListItem from './TxsListItem';
import TxsTable from './TxsTable';

type Props = {
  txs: TransactionsResponse['items'];
  sorting?: Sort;
  sort: (field: 'val' | 'fee') => () => void;
}

const TxsWithSort = ({
  txs,
  sorting,
  sort,
}: Props) => {
  const [ sortedTxs, setSortedTxs ] = useState(txs);

  useEffect(() => {
    switch (sorting) {
      case 'val-desc':
        setSortedTxs([ ...txs ].sort((tx1, tx2) => compareBns(tx1.value, tx2.value)));
        break;
      case 'val-asc':
        setSortedTxs([ ...txs ].sort((tx1, tx2) => compareBns(tx2.value, tx1.value)));
        break;
      case 'fee-desc':
        setSortedTxs([ ...txs ].sort((tx1, tx2) => compareBns(tx1.fee.value, tx2.fee.value)));
        break;
      case 'fee-asc':
        setSortedTxs([ ...txs ].sort((tx1, tx2) => compareBns(tx2.fee.value, tx1.fee.value)));
        break;
      default:
        setSortedTxs(txs);
    }
  }, [ sorting, txs ]);

  return (
    <>
      <Show below="lg" ssr={ false }><Box>{ sortedTxs.map(tx => <TxsListItem tx={ tx } key={ tx.hash }/>) }</Box></Show>
      <Show above="lg" ssr={ false }><TxsTable txs={ sortedTxs } sort={ sort } sorting={ sorting }/></Show>
    </>
  );

};

export default TxsWithSort;
