import { Box, Flex, Text, Skeleton } from '@chakra-ui/react';
import { route } from 'nextjs-routes';
import React from 'react';

import useApiQuery from 'lib/api/useApiQuery';
import useIsMobile from 'lib/hooks/useIsMobile';
import useNewTxsSocket from 'lib/hooks/useNewTxsSocket';
import LinkInternal from 'ui/shared/LinkInternal';
import SocketNewItemsNotice from 'ui/shared/SocketNewItemsNotice';

import LatestTxsItem from './LatestTxsItem';
import LatestTxsItemSkeleton from './LatestTxsItemSkeleton';

const LatestTransactions = () => {
  const isMobile = useIsMobile();
  const txsCount = isMobile ? 2 : 6;
  const { data, isLoading, isError } = useApiQuery('homepage_txs');

  const { num, socketAlert } = useNewTxsSocket();

  if (isLoading) {
    return (
      <>
        <Skeleton h="32px" w="100%" borderBottomLeftRadius={ 0 } borderBottomRightRadius={ 0 }/>
        { Array.from(Array(txsCount)).map((item, index) => <LatestTxsItemSkeleton key={ index }/>) }
      </>
    );
  }

  if (isError) {
    return <Text mt={ 4 }>No data. Please reload page.</Text>;
  }

  if (data) {
    const txsUrl = route({ pathname: '/txs' });
    return (
      <>
        <SocketNewItemsNotice borderBottomRadius={ 0 } url={ txsUrl } num={ num } alert={ socketAlert }/>
        <Box mb={{ base: 3, lg: 4 }}>
          { data.slice(0, txsCount).map((tx => <LatestTxsItem key={ tx.hash } tx={ tx }/>)) }
        </Box>
        <Flex justifyContent="center">
          <LinkInternal fontSize="sm" href={ txsUrl }>View all transactions</LinkInternal>
        </Flex>
      </>
    );
  }

  return null;
};

export default LatestTransactions;
