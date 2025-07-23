import { Box, Flex, Text } from '@chakra-ui/react';
import React from 'react';

import { route } from 'nextjs-routes';

import config from 'configs/app';
import useApiQuery from 'lib/api/useApiQuery';
import { AddressHighlightProvider } from 'lib/contexts/addressHighlight';
import useIsMobile from 'lib/hooks/useIsMobile';
import { zetaChainCCTX } from 'mocks/zetaChain/zetaChainCCTX';
import { TX } from 'stubs/tx';
import { Link } from 'toolkit/chakra/link';
import SocketNewItemsNotice from 'ui/shared/SocketNewItemsNotice';
import useNewTxsSocket from 'ui/txs/socket/useTxsSocketTypeAll';

import LatestTxsItem from './LatestTxsItem';
import LatestTxsItemMobile from './LatestTxsItemMobile';
import LatestZetaChainCCTXItem from './LatestZetaChainCCTXItem';

const zetachainFeature = config.features.zetachain;

const LatestZetahainCCTXs = () => {
  const isMobile = useIsMobile();
  const txsCount = isMobile ? 3 : 8;
  const { data, isPlaceholderData, isError } = useApiQuery('zetachain:transactions', {
    queryOptions: {
      placeholderData: { cctxs: Array(txsCount).fill(zetaChainCCTX) },
    },
    queryParams: {
      limit: txsCount,
      offset: 0,
    },
  });

  // const { num, showErrorAlert } = useNewTxsSocket({ type: 'txs_home', isLoading: isPlaceholderData });

  if (isError) {
    return <Text mt={ 4 }>No data. Please reload the page.</Text>;
  }

  if (data) {
    const txsUrl = route({ pathname: '/txs' });
    return (
      <>
        { /* <SocketNewItemsNotice borderBottomRadius={ 0 } url={ txsUrl } num={ num } showErrorAlert={ showErrorAlert } isLoading={ isPlaceholderData }/> */ }
        <Box mb={ 3 } display={{ base: 'block', lg: 'none' }}>
          { data.cctxs.slice(0, txsCount).map(((tx, index) => (
            <LatestZetaChainCCTXItem
              key={ tx.index + (isPlaceholderData ? index : '') }
              tx={ tx }
              isLoading={ isPlaceholderData }
            />
          ))) }
        </Box>
        <AddressHighlightProvider>
          <Box mb={ 3 } display={{ base: 'none', lg: 'block' }}>
            { data.cctxs.slice(0, txsCount).map(((tx, index) => (
              <LatestZetaChainCCTXItem
                key={ tx.index + (isPlaceholderData ? index : '') }
                tx={ tx }
                isLoading={ isPlaceholderData }
              />
            ))) }
          </Box>
        </AddressHighlightProvider>
        <Flex justifyContent="center">
          <Link textStyle="sm" href={ txsUrl }>View all transactions</Link>
        </Flex>
      </>
    );
  }

  return null;
};

export default LatestZetahainCCTXs;
