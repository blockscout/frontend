import { Flex } from '@chakra-ui/react';
import type { UseQueryResult } from '@tanstack/react-query';
import React from 'react';

import type { ChainIndicatorChartData } from './types';

import ChartLineLoader from 'ui/shared/chart/ChartLineLoader';
import DataFetchAlert from 'ui/shared/DataFetchAlert';

import ChainIndicatorChart from './ChainIndicatorChart';

type Props = UseQueryResult<ChainIndicatorChartData>;

const ChainIndicatorChartContainer = ({ data, isError, isLoading }: Props) => {

  const content = (() => {
    if (isLoading) {
      return <ChartLineLoader mt="auto"/>;
    }

    if (isError) {
      return <DataFetchAlert/>;
    }

    return <ChainIndicatorChart data={ data }/>;
  })();

  return <Flex h={{ base: '130px', lg: '270px' }} alignItems="flex-start">{ content }</Flex>;
};

export default React.memo(ChainIndicatorChartContainer);
