import { Box, Center, Flex, Text } from '@chakra-ui/react';
import React from 'react';

import type { ChartResolution } from '../types';
import type { LineChartAxesConfigFn, LineChartData } from './types';

import { Link } from '../../../chakra/link';
import { Skeleton } from '../../../chakra/skeleton';
import { apos } from '../../../utils/htmlEntities';
import { ChartWatermark } from '../components/ChartWatermark';
import { LineChart } from './LineChart';

export interface LineChartWidgetContentProps {
  charts: LineChartData;
  isLoading?: boolean;
  isError?: boolean;
  empty?: boolean;
  emptyText?: string;
  zoomRange?: [ Date, Date ];
  handleZoom: (range: [ Date, Date ]) => void;
  isEnlarged?: boolean;
  noAnimation?: boolean;
  resolution?: ChartResolution;
  axesConfig?: LineChartAxesConfigFn;
  noWatermark?: boolean;
};

export const LineChartWidgetContent = React.memo(({
  charts,
  isLoading,
  isError,
  empty,
  emptyText,
  zoomRange,
  handleZoom,
  isEnlarged,
  noAnimation,
  resolution,
  axesConfig,
  noWatermark,
}: LineChartWidgetContentProps) => {
  if (isError) {
    return (
      <Flex
        alignItems="center"
        justifyContent="center"
        flexGrow={ 1 }
        py={ 4 }
      >
        <Text
          color="text.secondary"
          fontSize="sm"
          textAlign="center"
        >
          { `The data didn${ apos }t load. Please, ` }
          <Link href={ window.document.location.href }>try to reload the page.</Link>
        </Text>
      </Flex>
    );
  }

  if (isLoading) {
    return <Skeleton loading flexGrow={ 1 } w="100%"/>;
  }

  if (empty || charts.length === 0) {
    return (
      <Center flexGrow={ 1 }>
        <Text color="text.secondary" fontSize="sm">{ emptyText || 'No data' }</Text>
      </Center>
    );
  }

  return (
    <Box flexGrow={ 1 } maxW="100%" position="relative" h="100%">
      <LineChart
        charts={ charts }
        zoomRange={ zoomRange }
        onZoom={ handleZoom }
        isEnlarged={ isEnlarged }
        noAnimation={ noAnimation }
        resolution={ resolution }
        axesConfig={ axesConfig }
      />
      { !noWatermark && <ChartWatermark w="162px" h="15%"/> }
    </Box>
  );
});
