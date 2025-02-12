import { Hide, Show, Table, Tbody, Th, Tr } from '@chakra-ui/react';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import React from 'react';

import type { SocketMessage } from 'lib/socket/types';
import type { AddressBlocksValidatedResponse } from 'types/api/address';

import config from 'configs/app';
import { getResourceKey } from 'lib/api/useApiQuery';
import useIsMounted from 'lib/hooks/useIsMounted';
import useSocketChannel from 'lib/socket/useSocketChannel';
import useSocketMessage from 'lib/socket/useSocketMessage';
import { currencyUnits } from 'lib/units';
import { BLOCK } from 'stubs/block';
import { generateListStub } from 'stubs/utils';
import ActionBar, { ACTION_BAR_HEIGHT_DESKTOP } from 'ui/shared/ActionBar';
import DataListDisplay from 'ui/shared/DataListDisplay';
import Pagination from 'ui/shared/pagination/Pagination';
import useQueryWithPages from 'ui/shared/pagination/useQueryWithPages';
import * as SocketNewItemsNotice from 'ui/shared/SocketNewItemsNotice';
import { default as Thead } from 'ui/shared/TheadSticky';

import AddressBlocksValidatedListItem from './blocksValidated/AddressBlocksValidatedListItem';
import AddressBlocksValidatedTableItem from './blocksValidated/AddressBlocksValidatedTableItem';

const OVERLOAD_COUNT = 75;

interface Props {
  scrollRef?: React.RefObject<HTMLDivElement>;
  shouldRender?: boolean;
  isQueryEnabled?: boolean;
}

const AddressBlocksValidated = ({ scrollRef, shouldRender = true, isQueryEnabled = true }: Props) => {
  const [ socketAlert, setSocketAlert ] = React.useState('');
  const [ newItemsCount, setNewItemsCount ] = React.useState(0);

  const queryClient = useQueryClient();
  const router = useRouter();
  const isMounted = useIsMounted();

  const addressHash = String(router.query.hash);
  const query = useQueryWithPages({
    resourceName: 'address_blocks_validated',
    pathParams: { hash: addressHash },
    scrollRef,
    options: {
      enabled: isQueryEnabled,
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
    setSocketAlert('An error has occurred while fetching new blocks. Please refresh the page to load new blocks.');
  }, []);

  const handleNewSocketMessage: SocketMessage.NewBlock['handler'] = React.useCallback((payload) => {
    setSocketAlert('');

    queryClient.setQueryData(
      getResourceKey('address_blocks_validated', { pathParams: { hash: addressHash } }),
      (prevData: AddressBlocksValidatedResponse | undefined) => {
        if (!prevData) {
          return;
        }

        if (prevData.items.length >= OVERLOAD_COUNT) {
          setNewItemsCount(prev => prev + 1);
          return prevData;
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

  if (!isMounted || !shouldRender) {
    return null;
  }

  const content = query.data?.items ? (
    <>
      <Hide below="lg" ssr={ false }>
        <Table style={{ tableLayout: 'auto' }}>
          <Thead top={ query.pagination.isVisible ? ACTION_BAR_HEIGHT_DESKTOP : 0 }>
            <Tr>
              <Th>Block</Th>
              <Th>Age</Th>
              <Th>Txn</Th>
              <Th>Gas used</Th>
              { !config.UI.views.block.hiddenFields?.total_reward && !config.features.rollup.isEnabled &&
              <Th isNumeric>Reward { currencyUnits.ether }</Th> }
            </Tr>
          </Thead>
          <Tbody>
            <SocketNewItemsNotice.Desktop
              url={ window.location.href }
              num={ newItemsCount }
              alert={ socketAlert }
              type="block"
              isLoading={ query.isPlaceholderData }
            />
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
        { query.pagination.page === 1 && (
          <SocketNewItemsNotice.Mobile
            url={ window.location.href }
            num={ newItemsCount }
            alert={ socketAlert }
            type="block"
            isLoading={ query.isPlaceholderData }
          />
        ) }
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
