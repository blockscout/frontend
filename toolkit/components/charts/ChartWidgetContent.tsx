import { Box, Center, Flex, Text } from '@chakra-ui/react';
import React from 'react';

import type { AxesConfigFn, Resolution, TimeChartData } from './types';

import { Link } from '../../chakra/link';
import { Skeleton } from '../../chakra/skeleton';
import { apos } from '../../utils/htmlEntities';
import { Chart } from './Chart';
import ChartWatermark from './parts/ChartWatermark';

export interface Props {
  charts: TimeChartData;
  title: string;
  isLoading?: boolean;
  isError?: boolean;
  empty?: boolean;
  emptyText?: string;
  zoomRange?: [ Date, Date ];
  handleZoom: (range: [ Date, Date ]) => void;
  isEnlarged?: boolean;
  noAnimation?: boolean;
  resolution?: Resolution;
  axesConfig?: AxesConfigFn;
};

const ChartWidgetContent = ({
  charts,
  title,
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
}: Props) => {
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
      <Chart
        charts={ charts }
        zoomRange={ zoomRange }
        onZoom={ handleZoom }
        title={ title }
        isEnlarged={ isEnlarged }
        noAnimation={ noAnimation }
        resolution={ resolution }
        axesConfig={ axesConfig }
      />
      <ChartWatermark w="162px" h="15%"/>
    </Box>
  );
};

export default React.memo(ChartWidgetContent);
