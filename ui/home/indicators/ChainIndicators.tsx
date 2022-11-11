import { Box, Flex, Icon, Text, Tooltip, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

import infoIcon from 'icons/info.svg';

import ChainIndicatorChartContainer from './ChainIndicatorChartContainer';
import ChainIndicatorItem from './ChainIndicatorItem';
import useFetchChartData from './useFetchChartData';
import INDICATORS from './utils/indicators';

const ChainIndicators = () => {
  const [ selectedIndicator, selectIndicator ] = React.useState(INDICATORS[0].id);
  const indicator = INDICATORS.find(({ id }) => id === selectedIndicator);
  const queryResult = useFetchChartData(indicator);

  const bgColor = useColorModeValue('white', 'gray.900');
  const listBgColor = useColorModeValue('gray.50', 'black');

  return (
    <Flex p={ 8 } borderRadius="lg" boxShadow="lg" bgColor={ bgColor } columnGap={ 12 } w="100%" alignItems="stretch">
      <Flex flexGrow={ 1 } flexDir="column">
        <Flex alignItems="center">
          <Text fontWeight={ 500 } fontFamily="Poppins" fontSize="lg">{ indicator?.title }</Text>
          { indicator?.hint && (
            <Tooltip label={ indicator.hint } maxW="300px">
              <Box display="inline-flex" cursor="pointer" ml={ 1 }>
                <Icon as={ infoIcon } boxSize={ 4 }/>
              </Box>
            </Tooltip>
          ) }
        </Flex>
        <Text fontWeight={ 600 } fontFamily="Poppins" fontSize="48px" lineHeight="48px" mt={ 3 } mb={ 4 }>{ indicator?.value }</Text>
        <ChainIndicatorChartContainer { ...queryResult }/>
      </Flex>
      <Flex flexShrink={ 0 } flexDir="column" as="ul" p={ 3 } borderRadius="lg" bgColor={ listBgColor } rowGap={ 3 }>
        { INDICATORS.map((indicator) => (
          <ChainIndicatorItem
            key={ indicator.id }
            { ...indicator }
            isSelected={ selectedIndicator === indicator.id }
            onClick={ selectIndicator }
          />
        )) }
      </Flex>
    </Flex>
  );
};

export default ChainIndicators;
