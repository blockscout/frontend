import { Box } from '@chakra-ui/react';
import type { UseQueryResult } from '@tanstack/react-query';
import React from 'react';

import type { ChainIndicatorChartData } from './types';

import ChainIndicatorChart from './ChainIndicatorChart';

type Props = UseQueryResult<ChainIndicatorChartData>;

const ChainIndicatorChartContainer = ({ data, isError, isLoading }: Props) => {

  const content = (() => {
    if (isLoading) {
      return 'loading...';
    }

    if (isError) {
      return 'error';
    }

    return <ChainIndicatorChart data={ data }/>;
  })();

  return <Box h="270px">{ content }</Box>;
};

export default React.memo(ChainIndicatorChartContainer);
