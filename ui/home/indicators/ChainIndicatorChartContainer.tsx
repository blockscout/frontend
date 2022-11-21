import { Flex, Spinner } from '@chakra-ui/react';
import type { UseQueryResult } from '@tanstack/react-query';
import React from 'react';

import type { ChainIndicatorChartData } from './types';

import DataFetchAlert from 'ui/shared/DataFetchAlert';

import ChainIndicatorChart from './ChainIndicatorChart';

type Props = UseQueryResult<ChainIndicatorChartData>;

const ChainIndicatorChartContainer = ({ data, isError, isLoading }: Props) => {

  const content = (() => {
    if (isLoading) {
      return <Spinner size="md" m="auto"/>;
    }

    if (isError) {
      return <DataFetchAlert/>;
    }

    return <ChainIndicatorChart data={ data }/>;
  })();

  return <Flex h={{ base: '150px', lg: 'auto' }} minH="150px" alignItems="flex-start" flexGrow={ 1 }>{ content }</Flex>;
};

export default React.memo(ChainIndicatorChartContainer);
