// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box, Flex, Text } from '@chakra-ui/react';
import { route } from 'nextjs-routes';
import React from 'react';

import useApiQuery from 'src/api/hooks/useApiQuery';

import LatestTxsFallback from 'src/slices/home/pages/index/txs/LatestTxsFallback';
import LatestTxsItem, { LATEST_TXS_TABLE_MIN_WIDTH } from 'src/slices/home/pages/index/txs/LatestTxsItem';
import { TX } from 'src/slices/tx/stubs/tx';

import useRedirectForInvalidAuthToken from 'src/features/account/hooks/useRedirectForInvalidAuthToken';

import useIsMobile from 'src/shared/hooks/useIsMobile';

import { Link } from 'src/toolkit/chakra/link';
import { TableBody, TableContainerScrollable, TableRoot } from 'src/toolkit/chakra/table';

const LatestWatchlistTxs = () => {
  useRedirectForInvalidAuthToken();
  const isMobile = useIsMobile();
  const txsCount = isMobile ? 2 : 5;
  const { data, isPlaceholderData, isError } = useApiQuery('core:homepage_txs_watchlist', {
    queryOptions: {
      placeholderData: Array(txsCount).fill(TX),
    },
  });

  if (isError) {
    return <LatestTxsFallback/>;
  }

  if (!data?.length) {
    return <Text>No latest transactions found.</Text>;
  }

  if (data) {
    const txsUrl = route({ pathname: '/txs', query: { tab: 'watchlist' } });
    return (
      <>
        <Box mb={ 4 } textStyle="sm">
          <TableContainerScrollable>
            <TableRoot minW={ LATEST_TXS_TABLE_MIN_WIDTH }>
              <TableBody>
                { data.slice(0, txsCount).map(((tx, index) => (
                  <LatestTxsItem
                    key={ tx.hash + (isPlaceholderData ? index : '') }
                    tx={ tx }
                    isLoading={ isPlaceholderData }
                  />
                ))) }
              </TableBody>
            </TableRoot>
          </TableContainerScrollable>
        </Box>
        <Flex justifyContent="center">
          <Link textStyle="sm" href={ txsUrl }>View all watch list transactions</Link>
        </Flex>
      </>
    );
  }

  return null;
};

export default LatestWatchlistTxs;
