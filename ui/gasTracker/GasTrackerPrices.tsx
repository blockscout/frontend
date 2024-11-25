import { Flex, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

import type { GasPrices } from 'types/api/stats';

import GasTrackerPriceSnippet from './GasTrackerPriceSnippet';

interface Props {
  prices: GasPrices;
  isLoading: boolean;
}

const GasTrackerPrices = ({ prices, isLoading }: Props) => {
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.300');

  return (
    <Flex
      as="ul"
      flexDir={{ base: 'column', lg: 'row' }}
      borderColor={ borderColor }
      borderWidth="2px"
      borderRadius="xl"
      overflow="hidden"
    >
      { prices.fast && <GasTrackerPriceSnippet type="fast" data={ prices.fast } isLoading={ isLoading }/> }
      { prices.average && <GasTrackerPriceSnippet type="average" data={ prices.average } isLoading={ isLoading }/> }
      { prices.slow && <GasTrackerPriceSnippet type="slow" data={ prices.slow } isLoading={ isLoading }/> }
    </Flex>
  );
};

export default React.memo(GasTrackerPrices);
