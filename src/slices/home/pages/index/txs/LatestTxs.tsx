// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box, Flex, Text } from '@chakra-ui/react';
import { route } from 'nextjs-routes';
import React from 'react';

import useApiQuery from 'src/api/hooks/useApiQuery';
import SocketNewItemsNotice from 'src/api/socket/SocketNewItemsNotice';

import { AddressHighlightProvider } from 'src/slices/address/contexts/address-highlight';
import useNewTxsSocket from 'src/slices/tx/hooks/useTxsSocketTypeAll';
import { TX } from 'src/slices/tx/stubs/tx';

import config from 'src/config';
import useIsMobile from 'src/shared/hooks/useIsMobile';

import { Link } from 'src/toolkit/chakra/link';
import { TableBody, TableContainerScrollable, TableRoot } from 'src/toolkit/chakra/table';

import LatestTxsDegraded from './LatestTxsDegraded';
import LatestTxsItem, { LATEST_TXS_TABLE_MIN_WIDTH } from './LatestTxsItem';

const zetachainFeature = config.features.zetachain;

const LatestTxs = () => {
  const isMobile = useIsMobile();
  const txsCount = isMobile ? 2 : 5;
  const { data, isPlaceholderData, isError } = useApiQuery('core:homepage_txs', {
    queryOptions: {
      placeholderData: Array(txsCount).fill(TX),
    },
  });

  const { num, showErrorAlert } = useNewTxsSocket({ type: 'txs_home', isLoading: isPlaceholderData });

  if (isError) {
    return <LatestTxsDegraded maxNum={ txsCount }/>;
  }

  if (data) {
    const txsUrl = route({ pathname: `/txs`, query: zetachainFeature.isEnabled ? { tab: 'evm' } : undefined });
    return (
      <>
        <AddressHighlightProvider>
          <Box mb={ 3 } textStyle="sm">
            <TableContainerScrollable>
              <SocketNewItemsNotice
                borderBottomRadius={ 0 }
                minW={ LATEST_TXS_TABLE_MIN_WIDTH }
                url={ txsUrl }
                num={ num }
                showErrorAlert={ showErrorAlert }
                isLoading={ isPlaceholderData }
              />
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
        </AddressHighlightProvider>
        <Flex justifyContent="center">
          <Link textStyle="sm" loading={ isPlaceholderData } href={ txsUrl }>View all transactions</Link>
        </Flex>
      </>
    );
  }

  return <Text>No latest transactions found.</Text>;
};

export default LatestTxs;
