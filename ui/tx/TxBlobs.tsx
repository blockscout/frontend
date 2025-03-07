import { Hide, Show } from '@chakra-ui/react';
import React from 'react';

import { TX_BLOB } from 'stubs/blobs';
import { generateListStub } from 'stubs/utils';
import ActionBar, { ACTION_BAR_HEIGHT_DESKTOP } from 'ui/shared/ActionBar';
import DataListDisplay from 'ui/shared/DataListDisplay';
import Pagination from 'ui/shared/pagination/Pagination';
import useQueryWithPages from 'ui/shared/pagination/useQueryWithPages';

import TxBlobsList from './blobs/TxBlobsList';
import TxBlobsTable from './blobs/TxBlobsTable';
import TxPendingAlert from './TxPendingAlert';
import TxSocketAlert from './TxSocketAlert';
import type { TxQuery } from './useTxQuery';

interface Props {
  txQuery: TxQuery;
}

const TxBlobs = ({ txQuery }: Props) => {
  const { data, isPlaceholderData, isError, pagination } = useQueryWithPages({
    resourceName: 'tx_blobs',
    pathParams: { hash: txQuery.data?.hash },
    options: {
      enabled: !txQuery.isPlaceholderData && Boolean(txQuery.data?.hash) && Boolean(txQuery.data?.status),
      placeholderData: generateListStub<'tx_blobs'>(TX_BLOB, 3, { next_page_params: null }),
    },
  });

  if (!txQuery.isPending && !txQuery.isPlaceholderData && !txQuery.isError && !txQuery.data.status) {
    return txQuery.socketStatus ? <TxSocketAlert status={ txQuery.socketStatus }/> : <TxPendingAlert/>;
  }

  const content = data ? (
    <>
      <Hide below="lg" ssr={ false }>
        <TxBlobsTable data={ data.items } isLoading={ isPlaceholderData } top={ pagination.isVisible ? ACTION_BAR_HEIGHT_DESKTOP : 0 }/>
      </Hide>
      <Show below="lg" ssr={ false }>
        <TxBlobsList data={ data.items } isLoading={ isPlaceholderData }/>
      </Show>
    </>
  ) : null;

  const actionBar = pagination.isVisible ? (
    <ActionBar mt={ -6 } showShadow>
      <Pagination ml="auto" { ...pagination }/>
    </ActionBar>
  ) : null;

  return (
    <DataListDisplay
      isError={ isError || txQuery.isError }
      items={ data?.items }
      emptyText="There are no blobs for this transaction."
      content={ content }
      actionBar={ actionBar }
    />
  );
};

export default TxBlobs;
