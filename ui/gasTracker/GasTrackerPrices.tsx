import { Flex, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

import type { GasPrices } from 'types/api/stats';

import colors from 'theme/foundations/colors';

import GasTrackerPriceSnippet from './GasTrackerPriceSnippet';

interface Props {
  prices: GasPrices;
  isLoading: boolean;
}

const GasTrackerPrices = ({ prices, isLoading }: Props) => {
  const borderColor = useColorModeValue('gray.200', colors.grayTrue[700]);

  return (
    <Flex
      as="ul"
      flexDir={{ base: 'column', lg: 'row' }}
      borderColor={ borderColor }
      borderWidth="1px"
      borderRadius="xl"
      overflow="hidden"
      sx={{
        'li:not(:last-child)': {
          borderColor: borderColor,
          borderRightWidth: { lg: '1px' },
          borderBottomWidth: { base: '1px', lg: '0' },
        },
      }}
    >
      { prices.fast && <GasTrackerPriceSnippet type="fast" data={ prices.fast } isLoading={ isLoading }/> }
      { prices.average && <GasTrackerPriceSnippet type="average" data={ prices.average } isLoading={ isLoading }/> }
      { prices.slow && <GasTrackerPriceSnippet type="slow" data={ prices.slow } isLoading={ isLoading }/> }
    </Flex>
  );
};

export default React.memo(GasTrackerPrices);
