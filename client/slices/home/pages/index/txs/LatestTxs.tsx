// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box, Flex, Text } from '@chakra-ui/react';
import React from 'react';

import { route } from 'nextjs-routes';

import useApiQuery from 'client/api/hooks/useApiQuery';

import { AddressHighlightProvider } from 'client/slices/address/contexts/address-highlight';
import useNewTxsSocket from 'client/slices/tx/hooks/useTxsSocketTypeAll';
import { TX } from 'client/slices/tx/stubs/tx';

import useIsMobile from 'client/shared/hooks/useIsMobile';

import config from 'configs/app';
import { Link } from 'toolkit/chakra/link';
import SocketNewItemsNotice from 'ui/shared/SocketNewItemsNotice';

import LatestTxsDegraded from './LatestTxsDegraded';
import LatestTxsItem from './LatestTxsItem';
import LatestTxsItemMobile from './LatestTxsItemMobile';

const zetachainFeature = config.features.zetachain;

const LatestTxs = () => {
  const isMobile = useIsMobile();
  const txsCount = isMobile ? 2 : 5;
  const { data, isPlaceholderData, isError } = useApiQuery('general:homepage_txs', {
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
        <SocketNewItemsNotice borderBottomRadius={ 0 } url={ txsUrl } num={ num } showErrorAlert={ showErrorAlert } isLoading={ isPlaceholderData }/>
        <Box mb={ 3 } display={{ base: 'block', lg: 'none' }} textStyle="sm">
          { data.slice(0, txsCount).map(((tx, index) => (
            <LatestTxsItemMobile
              key={ tx.hash + (isPlaceholderData ? index : '') }
              tx={ tx }
              isLoading={ isPlaceholderData }
            />
          ))) }
        </Box>
        <AddressHighlightProvider>
          <Box mb={ 3 } display={{ base: 'none', lg: 'block' }} textStyle="sm">
            { data.slice(0, txsCount).map(((tx, index) => (
              <LatestTxsItem
                key={ tx.hash + (isPlaceholderData ? index : '') }
                tx={ tx }
                isLoading={ isPlaceholderData }
              />
            ))) }
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
