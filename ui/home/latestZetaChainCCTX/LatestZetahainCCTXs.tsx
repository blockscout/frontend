import { Box, Flex, Text } from '@chakra-ui/react';
import React from 'react';

import { route } from 'nextjs-routes';

import useApiQuery from 'lib/api/useApiQuery';
import { AddressHighlightProvider } from 'lib/contexts/addressHighlight';
import useIsMobile from 'lib/hooks/useIsMobile';
import { zetaChainCCTX } from 'mocks/zetaChain/zetaChainCCTX';
import { Link } from 'toolkit/chakra/link';
import ZetaChainCCTXListItem from 'ui/txs/zetaChain/ZetaChainCCTXListItem';

import LatestZetaChainCCTXItem from './LatestZetaChainCCTXItem';

const LatestZetahainCCTXs = () => {
  const isMobile = useIsMobile();
  const txsCount = isMobile ? 3 : 8;
  const { data, isPlaceholderData, isError } = useApiQuery('zetachain:transactions', {
    queryOptions: {
      placeholderData: { items: Array(txsCount).fill(zetaChainCCTX), next_page_params: { page_index: 0, offset: 0, direction: 'DESC' } },
    },
    queryParams: {
      limit: txsCount,
      offset: 0,
      direction: 'DESC',
    },
  });

  if (isError) {
    return <Text mt={ 4 }>No data. Please reload the page.</Text>;
  }

  if (data) {
    const txsUrl = route({ pathname: '/txs' });
    return (
      <>
        <Box mb={ 3 } display={{ base: 'block', lg: 'none' }}>
          { data.items.slice(0, txsCount).map(((tx, index) => (
            <ZetaChainCCTXListItem
              key={ tx.index + (isPlaceholderData ? index : '') }
              tx={ tx }
              isLoading={ isPlaceholderData }
            />
          ))) }
        </Box>
        <AddressHighlightProvider>
          <Box mb={ 3 } display={{ base: 'none', lg: 'block' }}>
            { data.items.slice(0, txsCount).map(((tx, index) => (
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
