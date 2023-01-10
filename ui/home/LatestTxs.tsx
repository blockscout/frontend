import { Box, Heading, Flex, Link, Text, Skeleton } from '@chakra-ui/react';
import React from 'react';

import useApiQuery from 'lib/api/useApiQuery';
import useIsMobile from 'lib/hooks/useIsMobile';
import useNewTxsSocket from 'lib/hooks/useNewTxsSocket';
import link from 'lib/link/link';
import TxsNewItemNotice from 'ui/txs/TxsNewItemNotice';

import LatestTxsItem from './LatestTxsItem';
import LatestTxsItemSkeleton from './LatestTxsItemSkeleton';

const LatestTransactions = () => {
  const isMobile = useIsMobile();
  const txsCount = isMobile ? 2 : 6;
  const { data, isLoading, isError } = useApiQuery('homepage_txs');

  const { num, socketAlert } = useNewTxsSocket();

  let content;

  if (isLoading) {
    content = (
      <>
        <Skeleton h="32px" w="100%" borderBottomLeftRadius={ 0 } borderBottomRightRadius={ 0 }/>
        { Array.from(Array(txsCount)).map((item, index) => <LatestTxsItemSkeleton key={ index }/>) }
      </>
    );
  }

  if (isError) {
    content = <Text mt={ 4 }>No data. Please reload page.</Text>;
  }

  if (data) {
    const txsUrl = link('txs');
    content = (
      <>
        <TxsNewItemNotice borderBottomRadius={ 0 } url={ link('txs') } num={ num } alert={ socketAlert }/>
        <Box mb={{ base: 3, lg: 4 }}>
          { data.slice(0, txsCount).map((tx => <LatestTxsItem key={ tx.hash } tx={ tx }/>)) }
        </Box>
        <Flex justifyContent="center">
          <Link fontSize="sm" href={ txsUrl }>View all transactions</Link>
        </Flex>
      </>
    );
  }

  return (
    <Box flexGrow={ 1 }>
      <Heading as="h4" size="sm" mb={ 4 }>Latest transactions</Heading>
      { content }
    </Box>
  );
};

export default LatestTransactions;
