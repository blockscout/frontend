// SPDX-License-Identifier: LicenseRef-Blockscout

import { Text } from '@chakra-ui/react';
import React from 'react';

import ActionBar, { ACTION_BAR_HEIGHT_DESKTOP } from 'src/shell/page/action-bar/ActionBar';

import TxPendingAlert from 'src/slices/tx/components/TxPendingAlert';
import TxSocketAlert from 'src/slices/tx/components/TxSocketAlert';
import type { TxQuery } from 'src/slices/tx/hooks/useTxQuery';
import { TX_STATE_CHANGES } from 'src/slices/tx/stubs/state-changes';

import DataList from 'src/shared/lists/DataList';
import Pagination from 'src/shared/pagination/Pagination';
import useApiPaginatedQuery from 'src/shared/pagination/useApiPaginatedQuery';

import { TableContainerScrollable } from 'src/toolkit/chakra/table';

import TxStateTable from './TxStateTable';

interface Props {
  txQuery: TxQuery;
}

const TxState = ({ txQuery }: Props) => {
  const { data, isInitialLoading, isTransitioning, isError, pagination } = useApiPaginatedQuery({
    resourceName: 'core:tx_state_changes',
    pathParams: { hash: txQuery.data?.hash },
    options: {
      enabled: !txQuery.isPlaceholderData && Boolean(txQuery.data?.hash) && Boolean(txQuery.data?.status),
      placeholderData: {
        items: TX_STATE_CHANGES,
        next_page_params: {
          items_count: 1,
          state_changes: null,
        },
      },
    },
  });

  if (!txQuery.isPending && !txQuery.isPlaceholderData && !txQuery.isError && !txQuery.data.status) {
    return txQuery.socketStatus ? <TxSocketAlert status={ txQuery.socketStatus }/> : <TxPendingAlert/>;
  }

  const content = data ? (
    <TableContainerScrollable>
      <TxStateTable data={ data.items } isLoading={ isInitialLoading } top={ pagination.isVisible ? ACTION_BAR_HEIGHT_DESKTOP : 0 }/>
    </TableContainerScrollable>
  ) : null;

  const actionBar = pagination.isVisible ? (
    <ActionBar mt={ -6 } showShadow>
      <Pagination ml="auto" { ...pagination }/>
    </ActionBar>
  ) : null;

  return (
    <>
      { !isError && !txQuery.isError && (
        <Text mb={ 6 }>
          A set of information that represents the current state is updated when a transaction takes place on the network.
          The below is a summary of those changes.
        </Text>
      ) }
      <DataList
        isError={ isError || txQuery.isError }
        itemsNum={ data?.items.length }
        emptyText="There are no state changes for this transaction."
        actionBar={ actionBar }
        isTransitioning={ isTransitioning }
      >
        { content }
      </DataList>
    </>
  );
};

export default TxState;
