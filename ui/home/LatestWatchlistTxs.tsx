import { Box, Flex, Text } from '@chakra-ui/react';
import { route } from 'nextjs-routes';
import React from 'react';

import useApiQuery from 'lib/api/useApiQuery';
import useIsMobile from 'lib/hooks/useIsMobile';
import useRedirectForInvalidAuthToken from 'lib/hooks/useRedirectForInvalidAuthToken';
import LinkInternal from 'ui/shared/LinkInternal';

import LatestTxsItem from './LatestTxsItem';
import LatestTxsItemSkeleton from './LatestTxsItemSkeleton';

const LatestWatchlistTxs = () => {
  useRedirectForInvalidAuthToken();
  const isMobile = useIsMobile();
  const txsCount = isMobile ? 2 : 6;
  const { data, isLoading, isError } = useApiQuery('homepage_txs_watchlist');

  if (isLoading) {
    return <>{ Array.from(Array(txsCount)).map((item, index) => <LatestTxsItemSkeleton key={ index }/>) }</>;
  }

  if (isError) {
    return <Text mt={ 4 }>No data. Please reload page.</Text>;
  }

  if (data.length === 0) {
    return <Text mt={ 4 }>There are no transactions.</Text>;
  }

  if (data) {
    const txsUrl = route({ pathname: '/txs', query: { tab: 'watchlist' } });
    return (
      <>
        <Box mb={{ base: 3, lg: 4 }}>
          { data.slice(0, txsCount).map((tx => <LatestTxsItem key={ tx.hash } tx={ tx }/>)) }
        </Box>
        <Flex justifyContent="center">
          <LinkInternal fontSize="sm" href={ txsUrl }>View all watch list transactions</LinkInternal>
        </Flex>
      </>
    );
  }

  return null;
};

export default LatestWatchlistTxs;
