// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box } from '@chakra-ui/react';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import React from 'react';

import type { SocketMessage } from 'src/api/socket/types';
import type { AddressBlocksValidatedResponse } from 'src/slices/address/types/api';

import { getResourceKey } from 'src/api/hooks/useApiQuery';
import * as SocketNewItemsNotice from 'src/api/socket/SocketNewItemsNotice';
import useSocketChannel from 'src/api/socket/useSocketChannel';
import useSocketMessage from 'src/api/socket/useSocketMessage';

import ActionBar, { ACTION_BAR_HEIGHT_DESKTOP } from 'src/shell/page/action-bar/ActionBar';

import { BLOCK } from 'src/slices/block/stubs/block';
import { currencyUnits } from 'src/slices/chain/units';

import config from 'src/config';
import TimeFormatToggle from 'src/shared/date-and-time/TimeFormatToggle';
import useIsMounted from 'src/shared/hooks/useIsMounted';
import DataList from 'src/shared/lists/DataList';
import Pagination from 'src/shared/pagination/Pagination';
import useQueryWithPages from 'src/shared/pagination/useQueryWithPages';
import { generateListStub } from 'src/shared/pagination/utils';

import { TableBody, TableColumnHeader, TableHeaderSticky, TableRoot, TableRow } from 'src/toolkit/chakra/table';

import AddressBlocksValidatedListItem from './AddressBlocksValidatedListItem';
import AddressBlocksValidatedTableItem from './AddressBlocksValidatedTableItem';

const OVERLOAD_COUNT = 75;

interface Props {
  shouldRender?: boolean;
  isQueryEnabled?: boolean;
}

const AddressBlocksValidated = ({ shouldRender = true, isQueryEnabled = true }: Props) => {
  const [ showSocketAlert, setShowSocketAlert ] = React.useState(false);
  const [ newItemsCount, setNewItemsCount ] = React.useState(0);

  const queryClient = useQueryClient();
  const router = useRouter();
  const isMounted = useIsMounted();

  const addressHash = String(router.query.hash);
  const query = useQueryWithPages({
    resourceName: 'core:address_blocks_validated',
    pathParams: { hash: addressHash },
    options: {
      enabled: isQueryEnabled,
      placeholderData: generateListStub<'core:address_blocks_validated'>(
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
    setShowSocketAlert(true);
  }, []);

  const handleNewSocketMessage: SocketMessage.NewBlock['handler'] = React.useCallback((payload) => {
    setShowSocketAlert(false);

    queryClient.setQueryData(
      getResourceKey('core:address_blocks_validated', { pathParams: { hash: addressHash } }),
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
      <Box hideBelow="lg">
        <TableRoot tableLayout="auto">
          <TableHeaderSticky top={ query.pagination.isVisible ? ACTION_BAR_HEIGHT_DESKTOP : 0 }>
            <TableRow>
              <TableColumnHeader>Block</TableColumnHeader>
              <TableColumnHeader>
                Timestamp
                <TimeFormatToggle/>
              </TableColumnHeader>
              <TableColumnHeader>Txn</TableColumnHeader>
              <TableColumnHeader>Gas used</TableColumnHeader>
              { !config.slices.block.hiddenFields?.total_reward && !config.features.rollup.isEnabled &&
                <TableColumnHeader isNumeric>Reward { currencyUnits.ether }</TableColumnHeader> }
            </TableRow>
          </TableHeaderSticky>
          <TableBody>
            <SocketNewItemsNotice.Desktop
              num={ newItemsCount }
              showErrorAlert={ showSocketAlert }
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
          </TableBody>
        </TableRoot>
      </Box>
      <Box hideFrom="lg">
        { query.pagination.page === 1 && (
          <SocketNewItemsNotice.Mobile
            num={ newItemsCount }
            showErrorAlert={ showSocketAlert }
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
      </Box>
    </>
  ) : null;

  const actionBar = query.pagination.isVisible ? (
    <ActionBar mt={ -6 }>
      <Pagination ml="auto" { ...query.pagination }/>
    </ActionBar>
  ) : null;

  return (
    <DataList
      isError={ query.isError }
      itemsNum={ query.data?.items.length }
      emptyText="There are no validated blocks for this address."
      actionBar={ actionBar }
    >
      { content }
    </DataList>
  );
};

export default React.memo(AddressBlocksValidated);
