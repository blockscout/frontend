import { Box, Flex, Icon, Skeleton, Text, Tooltip, useColorModeValue } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import React from 'react';

import type { Stats } from 'types/api/stats';
import { QueryKeys } from 'types/client/queries';

import appConfig from 'configs/app/config';
import infoIcon from 'icons/info.svg';
import useFetch from 'lib/hooks/useFetch';

import ChainIndicatorChartContainer from './ChainIndicatorChartContainer';
import ChainIndicatorItem from './ChainIndicatorItem';
import useFetchChartData from './useFetchChartData';
import INDICATORS from './utils/indicators';

const indicators = INDICATORS
  .filter(({ id }) => appConfig.homepage.charts.includes(id))
  .sort((a, b) => {
    if (appConfig.homepage.charts.indexOf(a.id) > appConfig.homepage.charts.indexOf(b.id)) {
      return 1;
    }

    if (appConfig.homepage.charts.indexOf(a.id) < appConfig.homepage.charts.indexOf(b.id)) {
      return -1;
    }

    return 0;
  });

const ChainIndicators = () => {
  const [ selectedIndicator, selectIndicator ] = React.useState(indicators[0]?.id);
  const indicator = indicators.find(({ id }) => id === selectedIndicator);

  const queryResult = useFetchChartData(indicator);

  const fetch = useFetch();
  const statsQueryResult = useQuery<unknown, unknown, Stats>(
    [ QueryKeys.stats ],
    () => fetch('/node-api/stats'),
  );

  const bgColor = useColorModeValue('white', 'gray.900');
  const listBgColor = useColorModeValue('gray.50', 'black');

  if (indicators.length === 0) {
    return null;
  }

  const valueTitle = (() => {
    if (statsQueryResult.isLoading) {
      return <Skeleton h="48px" w="215px" mt={ 3 } mb={ 4 }/>;
    }

    if (statsQueryResult.isError) {
      return <Text mt={ 3 } mb={ 4 }>There is no data</Text>;
    }

    return (
      <Text fontWeight={ 600 } fontFamily="heading" fontSize="48px" lineHeight="48px" mt={ 3 } mb={ 4 }>
        { indicator?.value(statsQueryResult.data) }
      </Text>
    );
  })();

  return (
    <Flex
      p={ 8 }
      borderRadius="lg"
      boxShadow="lg"
      bgColor={ bgColor }
      columnGap={ 12 }
      rowGap={ 12 }
      flexDir={{ base: 'column', lg: 'row' }}
      w="100%"
      alignItems="stretch"
    >
      <Flex flexGrow={ 1 } flexDir="column">
        <Flex alignItems="center">
          <Text fontWeight={ 500 } fontFamily="heading" fontSize="lg">{ indicator?.title }</Text>
          { indicator?.hint && (
            <Tooltip label={ indicator.hint } maxW="300px">
              <Box display="inline-flex" cursor="pointer" ml={ 1 }>
                <Icon as={ infoIcon } boxSize={ 4 }/>
              </Box>
            </Tooltip>
          ) }
        </Flex>
        { valueTitle }
        <ChainIndicatorChartContainer { ...queryResult }/>
      </Flex>
      { indicators.length > 1 && (
        <Flex flexShrink={ 0 } flexDir="column" as="ul" p={ 3 } borderRadius="lg" bgColor={ listBgColor } rowGap={ 3 }>
          { indicators.map((indicator) => (
            <ChainIndicatorItem
              key={ indicator.id }
              { ...indicator }
              isSelected={ selectedIndicator === indicator.id }
              onClick={ selectIndicator }
              stats={ statsQueryResult }
            />
          )) }
        </Flex>
      ) }
    </Flex>
  );
};

export default ChainIndicators;
