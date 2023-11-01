import { Flex } from '@chakra-ui/react';
import type { UseQueryResult } from '@tanstack/react-query';
import React from 'react';

import type { TimeChartData } from 'ui/shared/chart/types';

import ContentLoader from 'ui/shared/ContentLoader';
import DataFetchAlert from 'ui/shared/DataFetchAlert';

import ChainIndicatorChart from './ChainIndicatorChart';

type Props = UseQueryResult<TimeChartData>;

const ChainIndicatorChartContainer = ({ data, isError, isPending }: Props) => {

  const content = (() => {
    if (isPending) {
      return <ContentLoader mt="auto"/>;
    }

    if (isError) {
      return <DataFetchAlert/>;
    }

    return <ChainIndicatorChart data={ data }/>;
  })();

  return <Flex h={{ base: '150px', lg: 'auto' }} minH="150px" alignItems="flex-start" flexGrow={ 1 }>{ content }</Flex>;
};

export default React.memo(ChainIndicatorChartContainer);
