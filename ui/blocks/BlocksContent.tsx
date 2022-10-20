import { Box, Text, Show, Alert, Skeleton } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import React from 'react';

import type { BlockType, BlocksResponse } from 'types/api/block';
import { QueryKeys } from 'types/client/accountQueries';

import useFetch from 'lib/hooks/useFetch';
import BlocksList from 'ui/blocks/BlocksList';
import BlocksSkeletonMobile from 'ui/blocks/BlocksSkeletonMobile';
import BlocksTable from 'ui/blocks/BlocksTable';
import DataFetchAlert from 'ui/shared/DataFetchAlert';
import Pagination from 'ui/shared/Pagination';
import SkeletonTable from 'ui/shared/SkeletonTable';

interface Props {
  type?: BlockType;
}

const BlocksContent = ({ type }: Props) => {
  const fetch = useFetch();

  const { data, isLoading, isError } = useQuery<unknown, unknown, BlocksResponse>(
    [ QueryKeys.blocks, type ],
    async() => await fetch(`/api/blocks${ type ? `?type=${ type }` : '' }`),
  );

  if (isLoading) {
    return (
      <>
        <Show below="lg" key="skeleton-mobile">
          <BlocksSkeletonMobile/>
        </Show>
        <Show above="lg" key="skeleton-desktop">
          <Skeleton h={ 6 } mb={ 8 } w="150px"/>
          <SkeletonTable columns={ [ '125px', '120px', '21%', '64px', '35%', '22%', '22%' ] }/>
        </Show>
      </>
    );
  }

  if (isError) {
    return <DataFetchAlert/>;
  }

  if (data.items.length === 0) {
    return <Alert>There are no blocks.</Alert>;
  }

  return (
    <>
      <Text>Total of { data.items[0].height.toLocaleString() } blocks</Text>
      <Show below="lg" key="content-mobile"><BlocksList data={ data.items }/></Show>
      <Show above="lg" key="content-desktop"><BlocksTable data={ data.items }/></Show>
      <Box mx={{ base: 0, lg: 6 }} my={{ base: 6, lg: 3 }}>
        <Pagination currentPage={ 1 }/>
      </Box>
    </>
  );
};

export default BlocksContent;
