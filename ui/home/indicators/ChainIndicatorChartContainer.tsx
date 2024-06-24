import { chakra, Flex, Box } from '@chakra-ui/react';
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
      return <ContentLoader mt="auto" fontSize="xs"/>;
    }

    if (isError) {
      return <DataFetchAlert fontSize="xs" p={ 3 }/>;
    }

    if (data[0].items.length === 0) {
      return <chakra.span fontSize="xs">no data</chakra.span>;
    }

    return (
      <Box mx="-10px" my="-5px" h="calc(100% + 10px)" w="calc(100% + 20px)">
        <ChainIndicatorChart data={ data }/>
      </Box>
    );
  })();

  return <Flex h={{ base: '80px', lg: '110px' }} alignItems="flex-start" flexGrow={ 1 }>{ content }</Flex>;
};

export default React.memo(ChainIndicatorChartContainer);
