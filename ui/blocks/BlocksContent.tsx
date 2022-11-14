import { Text, Show, Hide, Skeleton, Alert } from '@chakra-ui/react';
import { useQueryClient } from '@tanstack/react-query';
import React from 'react';

import type { SocketMessage } from 'lib/socket/types';
import type { BlockType, BlocksResponse } from 'types/api/block';
import { QueryKeys } from 'types/client/queries';

import useQueryWithPages from 'lib/hooks/useQueryWithPages';
import useSocketChannel from 'lib/socket/useSocketChannel';
import useSocketMessage from 'lib/socket/useSocketMessage';
import BlocksList from 'ui/blocks/BlocksList';
import BlocksSkeletonMobile from 'ui/blocks/BlocksSkeletonMobile';
import BlocksTable from 'ui/blocks/BlocksTable';
import ActionBar from 'ui/shared/ActionBar';
import DataFetchAlert from 'ui/shared/DataFetchAlert';
import Pagination from 'ui/shared/Pagination';
import SkeletonTable from 'ui/shared/SkeletonTable';

interface Props {
  type?: BlockType;
}

const BlocksContent = ({ type }: Props) => {
  const queryClient = useQueryClient();
  const [ socketAlert, setSocketAlert ] = React.useState('');

  const { data, isLoading, isError, pagination } = useQueryWithPages<BlocksResponse>('/node-api/blocks', QueryKeys.blocks, { type });

  const handleNewBlockMessage: SocketMessage.NewBlock['handler'] = React.useCallback((payload) => {
    queryClient.setQueryData([ QueryKeys.blocks, { page: pagination.page, filters: { type } } ], (prevData: BlocksResponse | undefined) => {
      const shouldAddToList = !type || type === payload.block.type;

      if (!prevData) {
        return {
          items: shouldAddToList ? [ payload.block ] : [],
          next_page_params: null,
        };
      }
      return shouldAddToList ? { ...prevData, items: [ payload.block, ...prevData.items ] } : prevData;
    });
  }, [ pagination.page, queryClient, type ]);

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
    isDisabled: isLoading || isError || pagination.page !== 1,
  });
  useSocketMessage({
    channel,
    event: 'new_block',
    handler: handleNewBlockMessage,
  });

  const content = (() => {
    if (isLoading) {
      return (
        <>
          <Show below="lg" key="skeleton-mobile">
            <BlocksSkeletonMobile/>
          </Show>
          <Hide below="lg" key="skeleton-desktop">
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
        { socketAlert && <Alert status="warning" mb={ 6 } as="a" href={ window.document.location.href }>{ socketAlert }</Alert> }
        <Show below="lg" key="content-mobile"><BlocksList data={ data.items }/></Show>
        <Hide below="lg" key="content-desktop"><BlocksTable data={ data.items }/></Hide>
      </>
    );

  })();

  return (
    <>
      { data ?
        <Text mb={{ base: 0, lg: 6 }}>Total of { data.items[0].height.toLocaleString() } blocks</Text> :
        <Skeleton h="24px" w="200px" mb={{ base: 0, lg: 6 }}/>
      }
      <ActionBar>
        <Pagination ml="auto" { ...pagination }/>
      </ActionBar>
      { content }
    </>
  );
};

export default BlocksContent;
