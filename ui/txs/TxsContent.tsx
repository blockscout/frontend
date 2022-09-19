import { Box } from '@chakra-ui/react';
import React, { useCallback, useEffect, useState } from 'react';

import { txs } from 'data/txs';
import useIsMobile from 'lib/hooks/useIsMobile';
import Filters from 'ui/shared/Filters';

import Pagination from './Pagination';
import TxsListItem from './TxsListItem';
import TxsTable from './TxsTable';

type Sort = 'val-desc' | 'val-asc' | 'fee-desc' | 'fee-asc' | undefined;

type Props = {
  isPending?: boolean;
}

const TxsContent = ({ isPending }: Props) => {
  const isMobile = useIsMobile();

  const [ sorting, setSorting ] = useState<Sort>();
  const [ sortedTxs, setSortedTxs ] = useState(txs);

  // sorting should be preserved with pagination!
  const sort = useCallback((field: 'val' | 'fee') => () => {
    if (field === 'val') {
      setSorting((prevVal => {
        if (prevVal === 'val-asc') {
          return undefined;
        }
        if (prevVal === 'val-desc') {
          return 'val-asc';
        }
        return 'val-desc';
      }));
    }
    if (field === 'fee') {
      setSorting((prevVal => {
        if (prevVal === 'fee-asc') {
          return undefined;
        }
        if (prevVal === 'fee-desc') {
          return 'fee-asc';
        }
        return 'fee-desc';
      }));
    }
  }, []);

  useEffect(() => {
    switch (sorting) {
      case 'val-desc':
        setSortedTxs([ ...txs ].sort((tx1, tx2) => tx1.amount.value - tx2.amount.value));
        break;
      case 'val-asc':
        setSortedTxs([ ...txs ].sort((tx1, tx2) => tx2.amount.value - tx1.amount.value));
        break;
      case 'fee-desc':
        setSortedTxs([ ...txs ].sort((tx1, tx2) => tx1.fee.value - tx2.fee.value));
        break;
      case 'fee-asc':
        setSortedTxs([ ...txs ].sort((tx1, tx2) => tx2.fee.value - tx1.fee.value));
        break;
      default:
        setSortedTxs(txs);
    }
  }, [ sorting ]);

  return (
    <>
      { !isPending && <Box mb={ 12 }>Only the first 10,000 elements are displayed</Box> }
      <Box mb={ 6 }><Filters isMobile={ isMobile }/></Box>
      { isMobile ?
        sortedTxs.map(tx => <TxsListItem tx={ tx } key={ tx.hash }/>) :
        <TxsTable txs={ sortedTxs } sort={ sort } sorting={ sorting }/> }
      <Box mx={ isMobile ? 0 : 6 } my={ isMobile ? 6 : 3 }>
        <Pagination currentPage={ 1 } isMobile={ isMobile }/>
      </Box>
    </>
  );
};

export default TxsContent;
