import {
  Box,
  Flex,
  useColorModeValue,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import React from 'react';

import type { Route } from 'nextjs-routes';

import Skeleton from 'ui/shared/chakra/Skeleton';

import type { LegendItem } from '../chart/Legend';
import Legend from '../chart/Legend';
import PieChart from '../chart/PieChart';

type Props = {
  label: string;
  value: string;
  data: Array<LegendItem>;
  chartData: Array<LegendItem>;
  valuePrefix?: string;
  valuePostfix?: string;
  hint?: string;
  isLoading?: boolean;
  diff?: string | number;
  diffFormatted?: string;
  diffPeriod?: '24h';
  period?: '1h' | '24h';
  href?: Route;
};

const Container = ({
  href,
  children,
}: {
  href?: Route;
  children: React.ReactNode;
}) => {
  if (href) {
    return (
      <NextLink href={ href } passHref legacyBehavior>
        { children }
      </NextLink>
    );
  }

  return children;
};

const PieChartWidget = ({
  data,
  chartData,
  isLoading,
  href,
}: Props) => {
  const bgColor = useColorModeValue('blue.50', 'whiteAlpha.100');
  const skeletonBgColor = useColorModeValue('blackAlpha.50', 'whiteAlpha.50');

  // Define the width and height for the pie chart
  const width = 200;
  const height = 200;

  return (
    <Container href={ !isLoading ? href : undefined }>
      <Flex
        width="full"
        alignItems="flex-start"
        bgColor={ isLoading ? skeletonBgColor : bgColor }
        px={ 3 }
        py={{ base: 2, lg: 3 }}
        borderRadius="md"
        justifyContent="space-between"
        columnGap={ 3 }
        { ...(href && !isLoading ?
          {
            as: 'a',
            href,
          } :
          {}) }
      >
        <Skeleton
          isLoaded={ !isLoading }
          display="flex"
          alignItems="baseline"
          mt={ 1 }
          width="full"
        >
          <Box w="100%">
            <Flex
              alignItems="flex-start"
              flexDirection="column"
              justifyContent="center"
              gap="5"
              width="full"
            >
              <Box w="100%">
                <svg width={ width } height={ height }>
                  <PieChart
                    data={ chartData }
                    width={ width }
                    height={ height }
                    disableAnimation={ false }
                  />
                </svg>
              </Box>

              <Box w="100%">
                <Legend items={ data }/>
              </Box>
            </Flex>
          </Box>
        </Skeleton>
        { /* {hint && (
          <Skeleton
            isLoaded={!isLoading}
            alignSelf="center"
            borderRadius="base"
          >
            <Hint label={hint} boxSize={6} color={hintColor} />
          </Skeleton>
        )} */ }
      </Flex>
    </Container>
  );
};

export default PieChartWidget;
