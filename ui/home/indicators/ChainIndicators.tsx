import { Flex, Skeleton, Text, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

import config from 'configs/app';
import useApiQuery from 'lib/api/useApiQuery';
import { HOMEPAGE_STATS } from 'stubs/stats';
import Hint from 'ui/shared/Hint';
import IconSvg from 'ui/shared/IconSvg';

import ChainIndicatorChartContainer from './ChainIndicatorChartContainer';
import ChainIndicatorItem from './ChainIndicatorItem';
import useFetchChartData from './useFetchChartData';
import INDICATORS from './utils/indicators';

const indicators = INDICATORS
  .filter(({ id }) => config.UI.homepage.charts.includes(id))
  .sort((a, b) => {
    if (config.UI.homepage.charts.indexOf(a.id) > config.UI.homepage.charts.indexOf(b.id)) {
      return 1;
    }

    if (config.UI.homepage.charts.indexOf(a.id) < config.UI.homepage.charts.indexOf(b.id)) {
      return -1;
    }

    return 0;
  });

const ChainIndicators = () => {
  const [ selectedIndicator, selectIndicator ] = React.useState(indicators[0]?.id);
  const indicator = indicators.find(({ id }) => id === selectedIndicator);

  const queryResult = useFetchChartData(indicator);
  const statsQueryResult = useApiQuery('stats', {
    queryOptions: {
      refetchOnMount: false,
      placeholderData: HOMEPAGE_STATS,
    },
  });

  const bgColor = useColorModeValue('gray.50', 'whiteAlpha.100');

  if (indicators.length === 0) {
    return null;
  }

  const valueTitle = (() => {
    if (statsQueryResult.isPlaceholderData) {
      return <Skeleton h="36px" w="215px"/>;
    }

    if (!statsQueryResult.data) {
      return <Text fontSize="xs">There is no data</Text>;
    }

    return (
      <Text fontWeight={ 700 } fontSize="30px" lineHeight="36px">
        { indicator?.value(statsQueryResult.data) }
      </Text>
    );
  })();

  const valueDiff = (() => {
    if (!statsQueryResult.data || !indicator?.valueDiff) {
      return null;
    }

    const diff = indicator.valueDiff(statsQueryResult.data);
    if (diff === undefined || diff === null) {
      return null;
    }

    const diffColor = diff >= 0 ? 'green.500' : 'red.500';

    return (
      <Skeleton isLoaded={ !statsQueryResult.isPlaceholderData } display="flex" alignItems="center" color={ diffColor } ml={ 2 }>
        <IconSvg name="arrows/up-head" boxSize={ 5 } mr={ 1 } transform={ diff < 0 ? 'rotate(180deg)' : 'rotate(0)' }/>
        <Text color={ diffColor } fontWeight={ 600 }>{ diff }%</Text>
      </Skeleton>
    );
  })();

  return (
    <Flex
      px={{ base: 3, lg: 4 }}
      py={ 3 }
      borderRadius="base"
      bgColor={ bgColor }
      columnGap={{ base: 3, lg: 4 }}
      rowGap={ 0 }
      flexBasis="50%"
      flexGrow={ 1 }
      alignItems="stretch"
    >
      <Flex flexGrow={ 1 } flexDir="column">
        <Flex alignItems="center">
          <Text fontWeight={ 500 }>{ indicator?.title }</Text>
          { indicator?.hint && <Hint label={ indicator.hint } ml={ 1 }/> }
        </Flex>
        <Flex mb={{ base: 0, lg: 2 }} mt={ 1 } alignItems="end">
          { valueTitle }
          { valueDiff }
        </Flex>
        <ChainIndicatorChartContainer { ...queryResult }/>
      </Flex>
      { indicators.length > 1 && (
        <Flex
          flexShrink={ 0 }
          flexDir="column"
          as="ul"
          borderRadius="lg"
          rowGap="6px"
          m={{ base: 'auto 0', lg: 0 }}
        >
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
