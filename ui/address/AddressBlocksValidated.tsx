import { Box, Hide, Show, Table, Tbody, Th, Tr } from '@chakra-ui/react';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import React from 'react';

import type { SocketMessage } from 'lib/socket/types';
import type { AddressBlocksValidatedResponse } from 'types/api/address';

import appConfig from 'configs/app/config';
import { getResourceKey } from 'lib/api/useApiQuery';
import useQueryWithPages from 'lib/hooks/useQueryWithPages';
import useSocketChannel from 'lib/socket/useSocketChannel';
import useSocketMessage from 'lib/socket/useSocketMessage';
import ActionBar from 'ui/shared/ActionBar';
import DataFetchAlert from 'ui/shared/DataFetchAlert';
import Pagination from 'ui/shared/Pagination';
import SkeletonList from 'ui/shared/skeletons/SkeletonList';
import SkeletonTable from 'ui/shared/skeletons/SkeletonTable';
import SocketAlert from 'ui/shared/SocketAlert';
import { default as Thead } from 'ui/shared/TheadSticky';

import AddressBlocksValidatedListItem from './blocksValidated/AddressBlocksValidatedListItem';
import AddressBlocksValidatedTableItem from './blocksValidated/AddressBlocksValidatedTableItem';

interface Props {
  scrollRef?: React.RefObject<HTMLDivElement>;
}

const AddressBlocksValidated = ({ scrollRef }: Props) => {
  const [ socketAlert, setSocketAlert ] = React.useState(false);
  const queryClient = useQueryClient();
  const router = useRouter();

  const addressHash = String(router.query?.id);
  const query = useQueryWithPages({
    resourceName: 'address_blocks_validated',
    pathParams: { id: addressHash },
    scrollRef,
  });

  const handleSocketError = React.useCallback(() => {
    setSocketAlert(true);
  }, []);

  const handleNewSocketMessage: SocketMessage.NewBlock['handler'] = React.useCallback((payload) => {
    setSocketAlert(false);

    queryClient.setQueryData(
      getResourceKey('address_blocks_validated', { pathParams: { id: addressHash } }),
      (prevData: AddressBlocksValidatedResponse | undefined) => {
        if (!prevData) {
          return;
        }

        return {
          ...prevData,
          items: [ payload.block, ...prevData.items ],
        };
      });
  }, [ addressHash, queryClient ]);

  const channel = useSocketChannel({
    topic: `blocks:${ addressHash.toLowerCase() }`,
    onSocketClose: handleSocketError,
    onSocketError: handleSocketError,
    isDisabled: !addressHash || query.pagination.page !== 1,
  });
  useSocketMessage({
    channel,
    event: 'new_block',
    handler: handleNewSocketMessage,
  });

  const content = (() => {
    if (query.isLoading) {
      return (
        <>
          <Hide below="lg" ssr={ false }>
            <SkeletonTable columns={ [ '17%', '17%', '16%', '25%', '25%' ] }/>
          </Hide>
          <Show below="lg" ssr={ false }>
            <SkeletonList/>
          </Show>
        </>
      );
    }

    if (query.isError) {
      return <DataFetchAlert/>;
    }

    if (query.data.items.length === 0) {
      return 'There is no validated blocks for this address';
    }

    return (
      <>
        <Hide below="lg" ssr={ false }>
          <Table variant="simple" size="sm">
            <Thead top={ query.isPaginationVisible ? 80 : 0 }>
              <Tr>
                <Th width="17%">Block</Th>
                <Th width="17%">Age</Th>
                <Th width="16%">Txn</Th>
                <Th width="25%">GasUsed</Th>
                <Th width="25%" isNumeric>Reward { appConfig.network.currency.symbol }</Th>
              </Tr>
            </Thead>
            <Tbody>
              { query.data.items.map((item) => (
                <AddressBlocksValidatedTableItem key={ item.height } { ...item } page={ query.pagination.page }/>
              )) }
            </Tbody>
          </Table>
        </Hide>
        <Show below="lg" ssr={ false }>
          { query.data.items.map((item) => (
            <AddressBlocksValidatedListItem key={ item.height } { ...item } page={ query.pagination.page }/>
          )) }
        </Show>
      </>
    );
  })();

  return (
    <Box>
      { query.isPaginationVisible && (
        <ActionBar mt={ -6 }>
          <Pagination ml="auto" { ...query.pagination }/>
        </ActionBar>
      ) }
      { socketAlert && <SocketAlert mb={ 6 }/> }
      { content }
    </Box>
  );
};

export default React.memo(AddressBlocksValidated);
