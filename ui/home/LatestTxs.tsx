import { Box, Heading, Flex, Link, Text } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import React from 'react';

import type { Transaction } from 'types/api/transaction';
import { QueryKeys } from 'types/client/queries';

import useFetch from 'lib/hooks/useFetch';
import useIsMobile from 'lib/hooks/useIsMobile';
import link from 'lib/link/link';

import LatestTxsItem from './LatestTxsItem';
import LatestTxsItemSkeleton from './LatestTxsItemSkeleton';
import LatestTxsNotice from './LatestTxsNotice';

const LatestTransactions = () => {
  const isMobile = useIsMobile();
  const txsCount = isMobile ? 2 : 6;
  const fetch = useFetch();
  const { data, isLoading, isError } = useQuery<unknown, unknown, Array<Transaction>>(
    [ QueryKeys.indexTxs ],
    async() => await fetch(`/api/index/txs`),
  );

  let content;

  if (isLoading) {
    content = (
      <>
        { Array.from(Array(txsCount)).map((item, index) => <LatestTxsItemSkeleton key={ index }/>) }
      </>
    );
  }

  if (isError) {
    content = <Text>There are no transactions. Please reload page.</Text>;
  }

  if (data) {
    content = (
      <Box mb={{ base: 3, lg: 6 }}>
        { data.slice(0, txsCount).map((tx => <LatestTxsItem key={ tx.hash } tx={ tx }/>)) }
      </Box>
    );
  }

  const txsUrl = link('txs');

  return (
    <>
      <Heading as="h4" fontSize="18px" mb={{ base: 3, lg: 8 }}>Latest transactions</Heading>
      { /* <TxsNewItemNotice mb={{ base: 3, lg: 8 }} url={ txsUrl }>{ ({ content }) => <Box>{ content }</Box> }</TxsNewItemNotice> */ }
      <LatestTxsNotice/>
      { content }
      <Flex justifyContent="center">
        <Link fontSize="sm" href={ txsUrl }>View all transactions</Link>
      </Flex>
    </>
  );
};

export default LatestTransactions;
