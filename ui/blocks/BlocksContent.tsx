import { Box, Text, Show, Hide, Skeleton, Alert } from '@chakra-ui/react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import React from 'react';

import type { SocketMessage } from 'lib/socket/types';
import type { BlockType, BlocksResponse } from 'types/api/block';
import { QueryKeys } from 'types/client/accountQueries';

import useFetch from 'lib/hooks/useFetch';
import useSocketChannel from 'lib/socket/useSocketChannel';
import useSocketMessage from 'lib/socket/useSocketMessage';
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
  const queryClient = useQueryClient();
  const [ socketAlert, setSocketAlert ] = React.useState('');

  const { data, isLoading, isError } = useQuery<unknown, unknown, BlocksResponse>(
    [ QueryKeys.blocks, type ],
    async() => await fetch(`/node-api/blocks${ type ? `?type=${ type }` : '' }`),
  );

  const handleNewBlockMessage: SocketMessage.NewBlock['handler'] = React.useCallback((payload) => {
    queryClient.setQueryData([ QueryKeys.blocks, type ], (prevData: BlocksResponse | undefined) => {
      const shouldAddToList = !type || type === payload.block.type;

      if (!prevData) {
        return {
          items: shouldAddToList ? [ payload.block ] : [],
          next_page_params: null,
        };
      }
      return shouldAddToList ? { ...prevData, items: [ payload.block, ...prevData.items ] } : prevData;
    });
  }, [ queryClient, type ]);

  const handleSocketClose = React.useCallback(() => {
    setSocketAlert('Connection is lost. Please click here to load new blocks.');
  }, []);

  const handleSocketError = React.useCallback(() => {
    setSocketAlert('An error has occurred while fetching new blocks. Please click here to refresh the page.');
  }, []);

  const channel = useSocketChannel({
    topic: 'blocks:new_block',
    onSocketClose: handleSocketClose,
    onSocketError: handleSocketError,
    isDisabled: isLoading || isError,
  });
  useSocketMessage({
    channel,
    event: 'new_block',
    handler: handleNewBlockMessage,
  });

  if (isLoading) {
    return (
      <>
        <Show below="lg" key="skeleton-mobile">
          <BlocksSkeletonMobile/>
        </Show>
        <Hide below="lg" key="skeleton-desktop">
          <Skeleton h={ 6 } mb={ 8 } w="150px"/>
          <SkeletonTable columns={ [ '125px', '120px', '21%', '64px', '35%', '22%', '22%' ] }/>
        </Hide>
      </>
    );
  }

  if (isError) {
    return <DataFetchAlert/>;
  }

  if (data.items.length === 0) {
    return <Text as="span">There are no blocks.</Text>;
  }

  return (
    <>
      <Text as="span">Total of { data.items[0].height.toLocaleString() } blocks</Text>
      { socketAlert && <Alert status="warning" mt={ 8 } as="a" href={ window.document.location.href }>{ socketAlert }</Alert> }
      <Show below="lg" key="content-mobile"><BlocksList data={ data.items }/></Show>
      <Hide below="lg" key="content-desktop"><BlocksTable data={ data.items }/></Hide>
      <Box mx={{ base: 0, lg: 6 }} my={{ base: 6, lg: 3 }}>
        { /* eslint-disable-next-line react/jsx-no-bind */ }
        <Pagination page={ 1 } onNextPageClick={ () => {} } onPrevPageClick={ () => {} } resetPage={ () => {} } hasNextPage/>
      </Box>
    </>
  );
};

export default BlocksContent;
