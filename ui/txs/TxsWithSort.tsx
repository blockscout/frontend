import { Box, Show, Hide } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';

import type { TransactionsResponse } from 'types/api/transaction';
import type { Sort } from 'types/client/txs-sort';

import sortTxs from 'lib/tx/sortTxs';

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
  const [ sortedTxs, setSortedTxs ] = useState<TransactionsResponse['items']>(sortTxs(txs, sorting));

  useEffect(() => {
    setSortedTxs(sortTxs(txs, sorting));
  }, [ sorting, txs ]);

  return (
    <>
      <Show below="lg" ssr={ false }><Box>{ sortedTxs.map(tx => <TxsListItem tx={ tx } key={ tx.hash }/>) }</Box></Show>
      <Hide below="lg" ssr={ false }><TxsTable txs={ sortedTxs } sort={ sort } sorting={ sorting }/></Hide>
    </>
  );

};

export default TxsWithSort;
