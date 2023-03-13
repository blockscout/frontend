import { Box, Text, chakra } from '@chakra-ui/react';
import React from 'react';

import EmptySearchResult from 'ui/apps/EmptySearchResult';

import DataFetchAlert from './DataFetchAlert';
import SkeletonList from './skeletons/SkeletonList';
import SkeletonTable from './skeletons/SkeletonTable';

type Props = {
  isError: boolean;
  isLoading: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  items?: Array<any>;
  emptyText: string;
  skeletonDesktopColumns: Array<string>;
  isLongSkeleton?: boolean;
  actionBar?: React.ReactNode;
  content: React.ReactNode;
  className?: string;
  hasActiveFilters?: boolean;
  emptyFilteredText?: string;
}

const DataListDisplay = (props: Props) => {
  if (props.isError) {
    return <DataFetchAlert/>;
  }

  if (props.isLoading) {
    return (
      <>
        { props.actionBar }
        <SkeletonList display={{ base: 'block', lg: 'none' }}/>
        <SkeletonTable
          display={{ base: 'none', lg: 'block' }}
          columns={ props.skeletonDesktopColumns }
          isLong={ props.isLongSkeleton }
        />
      </>
    );
  }

  if (props.hasActiveFilters && !props.items?.length) {
    return (
      <>
        { props.actionBar }
        <EmptySearchResult text={ props.emptyFilteredText }/>
      </>
    );
  }

  if (!props.items?.length) {
    return <Text as="span">{ props.emptyText }</Text>;
  }

  return (
    <Box className={ props.className }>
      { props.actionBar }
      { props.content }
    </Box>
  );
};

export default chakra(DataListDisplay);
