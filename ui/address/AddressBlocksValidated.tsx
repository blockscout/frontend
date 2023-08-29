import { Hide, Show, Table, Tbody, Th, Tr } from '@chakra-ui/react';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import React from 'react';

import type { SocketMessage } from 'lib/socket/types';
import type { AddressBlocksValidatedResponse } from 'types/api/address';

import config from 'configs/app';
import { getResourceKey } from 'lib/api/useApiQuery';
import useSocketChannel from 'lib/socket/useSocketChannel';
import useSocketMessage from 'lib/socket/useSocketMessage';
import { BLOCK } from 'stubs/block';
import { generateListStub } from 'stubs/utils';
import ActionBar from 'ui/shared/ActionBar';
import DataListDisplay from 'ui/shared/DataListDisplay';
import Pagination from 'ui/shared/pagination/Pagination';
import useQueryWithPages from 'ui/shared/pagination/useQueryWithPages';
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

  const addressHash = String(router.query.hash);
  const query = useQueryWithPages({
    resourceName: 'address_blocks_validated',
    pathParams: { hash: addressHash },
    scrollRef,
    options: {
      placeholderData: generateListStub<'address_blocks_validated'>(
        BLOCK,
        50,
        {
          next_page_params: {
            block_number: 9060562,
            items_count: 50,
          },
        },
      ),
    },
  });

  const handleSocketError = React.useCallback(() => {
    setSocketAlert(true);
  }, []);

  const handleNewSocketMessage: SocketMessage.NewBlock['handler'] = React.useCallback((payload) => {
    setSocketAlert(false);

    queryClient.setQueryData(
      getResourceKey('address_blocks_validated', { pathParams: { hash: addressHash } }),
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
    isDisabled: !addressHash || query.isPlaceholderData || query.pagination.page !== 1,
  });
  useSocketMessage({
    channel,
    event: 'new_block',
    handler: handleNewSocketMessage,
  });

  const content = query.data?.items ? (
    <>
      { socketAlert && <SocketAlert mb={ 6 }/> }
      <Hide below="lg" ssr={ false }>
        <Table variant="simple" size="sm">
          <Thead top={ query.pagination.isVisible ? 80 : 0 }>
            <Tr>
              <Th width="17%">Block</Th>
              <Th width="17%">Age</Th>
              <Th width="16%">Txn</Th>
              <Th width="25%">Gas used</Th>
              { !config.UI.views.block.hiddenFields?.total_reward &&
              <Th width="25%" isNumeric>Reward { config.chain.currency.symbol }</Th> }
            </Tr>
          </Thead>
          <Tbody>
            { query.data.items.map((item, index) => (
              <AddressBlocksValidatedTableItem
                key={ item.height + (query.isPlaceholderData ? String(index) : '') }
                { ...item }
                page={ query.pagination.page }
                isLoading={ query.isPlaceholderData }
              />
            )) }
          </Tbody>
        </Table>
      </Hide>
      <Show below="lg" ssr={ false }>
        { query.data.items.map((item, index) => (
          <AddressBlocksValidatedListItem
            key={ item.height + (query.isPlaceholderData ? String(index) : '') }
            { ...item }
            page={ query.pagination.page }
            isLoading={ query.isPlaceholderData }
          />
        )) }
      </Show>
    </>
  ) : null;

  const actionBar = query.pagination.isVisible ? (
    <ActionBar mt={ -6 }>
      <Pagination ml="auto" { ...query.pagination }/>
    </ActionBar>
  ) : null;

  return (
    <DataListDisplay
      isError={ query.isError }
      items={ query.data?.items }
      emptyText="There are no validated blocks for this address."
      content={ content }
      actionBar={ actionBar }
    />
  );
};

export default React.memo(AddressBlocksValidated);
