import { Box, Flex, Text } from '@chakra-ui/react';
import React from 'react';

import { route } from 'nextjs-routes';

import useApiQuery from 'lib/api/useApiQuery';
import useIsMobile from 'lib/hooks/useIsMobile';
import useRedirectForInvalidAuthToken from 'lib/hooks/useRedirectForInvalidAuthToken';
import { TX } from 'stubs/tx';
import LinkInternal from 'ui/shared/LinkInternal';

import LatestTxsItem from './LatestTxsItem';
import LatestTxsItemMobile from './LatestTxsItemMobile';

const LatestWatchlistTxs = () => {
  useRedirectForInvalidAuthToken();
  const isMobile = useIsMobile();
  const txsCount = isMobile ? 2 : 6;
  const { data, isPlaceholderData, isError } = useApiQuery('homepage_txs_watchlist', {
    queryOptions: {
      placeholderData: Array(txsCount).fill(TX),
    },
  });

  if (isError) {
    return <Text mt={ 4 }>No data. Please reload page.</Text>;
  }

  if (!data?.length) {
    return <Text mt={ 4 }>There are no transactions.</Text>;
  }

  if (data) {
    const txsUrl = route({ pathname: '/txs', query: { tab: 'watchlist' } });
    return (
      <>
        <Box mb={ 3 } display={{ base: 'block', lg: 'none' }}>
          { data.slice(0, txsCount).map(((tx, index) => (
            <LatestTxsItemMobile
              key={ tx.hash + (isPlaceholderData ? index : '') }
              tx={ tx }
              isLoading={ isPlaceholderData }
            />
          ))) }
        </Box>
        <Box mb={ 4 } display={{ base: 'none', lg: 'block' }}>
          { data.slice(0, txsCount).map(((tx, index) => (
            <LatestTxsItem
              key={ tx.hash + (isPlaceholderData ? index : '') }
              tx={ tx }
              isLoading={ isPlaceholderData }
            />
          ))) }
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
