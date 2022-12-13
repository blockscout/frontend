import { Box, Hide, Show, Table, Tbody, Th, Tr } from '@chakra-ui/react';
import { useQueryClient } from '@tanstack/react-query';
import type { UseQueryResult } from '@tanstack/react-query';
import React from 'react';

import type { SocketMessage } from 'lib/socket/types';
import type { Address, AddressBlocksValidatedResponse } from 'types/api/address';
import { QueryKeys } from 'types/client/queries';

import appConfig from 'configs/app/config';
import useQueryWithPages from 'lib/hooks/useQueryWithPages';
import useSocketChannel from 'lib/socket/useSocketChannel';
import useSocketMessage from 'lib/socket/useSocketMessage';
import ActionBar from 'ui/shared/ActionBar';
import DataFetchAlert from 'ui/shared/DataFetchAlert';
import Pagination from 'ui/shared/Pagination';
import SkeletonTable from 'ui/shared/SkeletonTable';
import SocketAlert from 'ui/shared/SocketAlert';
import { default as Thead } from 'ui/shared/TheadSticky';

import AddressBlocksValidatedListItem from './blocksValidated/AddressBlocksValidatedListItem';
import AddressBlocksValidatedSkeletonMobile from './blocksValidated/AddressBlocksValidatedSkeletonMobile';
import AddressBlocksValidatedTableItem from './blocksValidated/AddressBlocksValidatedTableItem';

interface Props {
  addressQuery: UseQueryResult<Address>;
}

const AddressBlocksValidated = ({ addressQuery }: Props) => {
  const [ socketAlert, setSocketAlert ] = React.useState(false);
  const queryClient = useQueryClient();

  const query = useQueryWithPages({
    apiPath: `/node-api/addresses/${ addressQuery.data?.hash }/blocks-validated`,
    queryName: QueryKeys.addressBlocksValidated,
    options: {
      enabled: Boolean(addressQuery.data),
    },
  });

  const handleSocketError = React.useCallback(() => {
    setSocketAlert(true);
  }, []);

  const handleNewSocketMessage: SocketMessage.NewBlock['handler'] = React.useCallback((payload) => {
    setSocketAlert(false);

    queryClient.setQueryData(
      [ QueryKeys.addressBlocksValidated, { page: query.pagination.page } ],
      (prevData: AddressBlocksValidatedResponse | undefined) => {
        if (!prevData) {
          return;
        }

        return {
          ...prevData,
          items: [ payload.block, ...prevData.items ],
        };
      });
  }, [ query.pagination.page, queryClient ]);

  const channel = useSocketChannel({
    topic: `blocks:${ addressQuery.data?.hash.toLowerCase() }`,
    onSocketClose: handleSocketError,
    onSocketError: handleSocketError,
    isDisabled: addressQuery.isLoading || addressQuery.isError || !addressQuery.data.hash || query.pagination.page !== 1,
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
          <Hide below="lg">
            <SkeletonTable columns={ [ '17%', '17%', '16%', '25%', '25%' ] }/>
          </Hide>
          <Show below="lg">
            <AddressBlocksValidatedSkeletonMobile/>
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
        <Hide below="lg">
          <Table variant="simple" size="sm">
            <Thead top={ 80 }>
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
        <Show below="lg">
          { query.data.items.map((item) => (
            <AddressBlocksValidatedListItem key={ item.height } { ...item } page={ query.pagination.page }/>
          )) }
        </Show>
      </>
    );
  })();

  const isPaginatorHidden = !query.isLoading && !query.isError && query.pagination.page === 1 && !query.pagination.hasNextPage;

  return (
    <Box>
      { !isPaginatorHidden && (
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
