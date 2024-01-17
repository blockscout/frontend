import { Hide, Show } from '@chakra-ui/react';
import React from 'react';

import { SECOND } from 'lib/consts';
import { USER_OPS_ITEM } from 'stubs/userOps';
import { generateListStub } from 'stubs/utils';
import ActionBar from 'ui/shared/ActionBar';
import DataFetchAlert from 'ui/shared/DataFetchAlert';
import DataListDisplay from 'ui/shared/DataListDisplay';
import Pagination from 'ui/shared/pagination/Pagination';
import useQueryWithPages from 'ui/shared/pagination/useQueryWithPages';
import TxPendingAlert from 'ui/tx/TxPendingAlert';
import TxSocketAlert from 'ui/tx/TxSocketAlert';
import useFetchTxInfo from 'ui/tx/useFetchTxInfo';
import UserOpsListItem from 'ui/userOps/UserOpsListItem';
import UserOpsTable from 'ui/userOps/UserOpsTable';

const TxTokenTransfer = () => {
  const txsInfo = useFetchTxInfo({ updateDelay: 5 * SECOND });

  const userOpsQuery = useQueryWithPages({
    resourceName: 'user_ops',
    options: {
      enabled: !txsInfo.isPlaceholderData && Boolean(txsInfo.data?.status && txsInfo.data?.hash),
      // most often there is only one user op in one tx
      placeholderData: generateListStub<'user_ops'>(USER_OPS_ITEM, 1, { next_page_params: null }),
    },
    filters: { transaction_hash: txsInfo.data?.hash },
  });

  if (!txsInfo.isPending && !txsInfo.isPlaceholderData && !txsInfo.isError && !txsInfo.data.status) {
    return txsInfo.socketStatus ? <TxSocketAlert status={ txsInfo.socketStatus }/> : <TxPendingAlert/>;
  }

  if (txsInfo.isError || userOpsQuery.isError) {
    return <DataFetchAlert/>;
  }

  const content = userOpsQuery.data?.items ? (
    <>
      <Hide below="lg" ssr={ false }>
        <UserOpsTable items={ userOpsQuery.data?.items } top={ userOpsQuery.pagination.isVisible ? 0 : 80 } isLoading={ userOpsQuery.isPlaceholderData }/>
      </Hide>
      <Show below="lg" ssr={ false }>
        { userOpsQuery.data.items.map(((item, index) => (
          <UserOpsListItem
            key={ item.hash + (userOpsQuery.isPlaceholderData ? String(index) : '') }
            item={ item }
            isLoading={ userOpsQuery.isPlaceholderData }
          />
        ))) }
      </Show>
    </>
  ) : null;

  const actionBar = userOpsQuery.pagination.isVisible ? (
    <ActionBar mt={ -6 } alignItems="center">
      <Pagination ml="auto" { ...userOpsQuery.pagination }/>
    </ActionBar>
  ) : null;

  return (
    <DataListDisplay
      isError={ txsInfo.isError || userOpsQuery.isError }
      items={ userOpsQuery.data?.items }
      emptyText="There are no user operations."
      content={ content }
      actionBar={ actionBar }
    />
  );
};

export default TxTokenTransfer;
