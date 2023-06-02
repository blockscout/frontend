import { Box, Flex, Text } from '@chakra-ui/react';
import { route } from 'nextjs-routes';
import React from 'react';

import useApiQuery from 'lib/api/useApiQuery';
import useIsMobile from 'lib/hooks/useIsMobile';
import useNewTxsSocket from 'lib/hooks/useNewTxsSocket';
import { TX } from 'stubs/tx';
import LinkInternal from 'ui/shared/LinkInternal';
import SocketNewItemsNotice from 'ui/shared/SocketNewItemsNotice';

import LatestTxsItem from './LatestTxsItem';

const LatestTransactions = () => {
  const isMobile = useIsMobile();
  const txsCount = isMobile ? 2 : 6;
  const { data, isPlaceholderData, isError } = useApiQuery('homepage_txs', {
    queryOptions: {
      placeholderData: Array(txsCount).fill(TX),
    },
  });

  const { num, socketAlert } = useNewTxsSocket();

  if (isError) {
    return <Text mt={ 4 }>No data. Please reload page.</Text>;
  }

  if (data) {
    const txsUrl = route({ pathname: '/txs' });
    return (
      <>
        <SocketNewItemsNotice borderBottomRadius={ 0 } url={ txsUrl } num={ num } alert={ socketAlert } isLoading={ isPlaceholderData }/>
        <Box mb={{ base: 3, lg: 4 }}>
          { data.slice(0, txsCount).map(((tx, index) => (
            <LatestTxsItem
              key={ tx.hash + (isPlaceholderData ? index : '') }
              tx={ tx }
              isLoading={ isPlaceholderData }
            />
          ))) }
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
