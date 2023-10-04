import { Box, Heading, Flex, Text, VStack } from '@chakra-ui/react';
// import { AnimatePresence } from 'framer-motion';
import React from 'react';

import { route } from 'nextjs-routes';

import useApiQuery from 'lib/api/useApiQuery';
import useIsMobile from 'lib/hooks/useIsMobile';
import { ZKEVM_L2_TXN_BATCHES_ITEM } from 'stubs/zkEvmL2';
import LinkInternal from 'ui/shared/LinkInternal';

import LatestZkevmL2BatchItem from './LatestZkevmL2BatchItem';

const LatestZkEvmL2Batches = () => {
  const isMobile = useIsMobile();
  const batchesMaxCount = isMobile ? 2 : 3;

  const { data, isPlaceholderData, isError } = useApiQuery('homepage_zkevm_l2_batches', {
    queryOptions: {
      placeholderData: { items: Array(batchesMaxCount).fill(ZKEVM_L2_TXN_BATCHES_ITEM) },
    },
  });

  let content;

  if (isError) {
    content = <Text>No data. Please reload page.</Text>;
  }

  if (data) {
    const dataToShow = data.items.slice(0, batchesMaxCount);

    content = (
      <>
        <VStack spacing={ 3 } mb={ 4 } overflow="hidden" alignItems="stretch">
          { /* <AnimatePresence initial={ false } > */ }
          { dataToShow.map(((batch, index) => (
            <LatestZkevmL2BatchItem
              key={ batch.number + (isPlaceholderData ? String(index) : '') }
              batch={ batch }
              isLoading={ isPlaceholderData }
            />
          ))) }
          { /* </AnimatePresence> */ }
        </VStack>
        <Flex justifyContent="center">
          <LinkInternal fontSize="sm" href={ route({ pathname: '/zkevm-l2-txn-batches' }) }>View all batches</LinkInternal>
        </Flex>
      </>
    );
  }

  return (
    <Box width={{ base: '100%', lg: '280px' }} flexShrink={ 0 }>
      <Heading as="h4" size="sm" mb={ 4 }>Latest batches</Heading>
      { content }
    </Box>
  );
};

export default LatestZkEvmL2Batches;
