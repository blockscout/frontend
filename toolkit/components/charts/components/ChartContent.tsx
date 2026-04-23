import { Box, Center, Flex, Text } from '@chakra-ui/react';
import React from 'react';

import { EmptyState } from '../../../chakra/empty-state';
import { Link } from '../../../chakra/link';
import { Skeleton } from '../../../chakra/skeleton';
import { apos } from '../../../utils/htmlEntities';
import { ChartWatermark } from './ChartWatermark';

export interface ChartContentProps {
  isError?: boolean;
  isLoading?: boolean;
  isEmpty?: boolean;
  emptyText?: string;
  noWatermark?: boolean;
  children: React.ReactNode;
}

export const ChartContent = ({ isError, isLoading, isEmpty, emptyText, noWatermark, children }: ChartContentProps) => {
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

  if (isEmpty) {
    return (
      <Center flexGrow={ 1 }>
        <EmptyState type="stats" description={ emptyText } mt={ 0 }/>
      </Center>
    );
  }

  return (
    <Box flexGrow={ 1 } maxW="100%" position="relative" h="100%">
      { children }
      { !noWatermark && <ChartWatermark w="162px" h="15%"/> }
    </Box>
  );
};
