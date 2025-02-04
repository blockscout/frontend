import { Hide, Show } from '@chakra-ui/react';
import React from 'react';

import useIsMobile from 'lib/hooks/useIsMobile';
import { INTERNAL_TX } from 'stubs/internalTx';
import { generateListStub } from 'stubs/utils';
import InternalTxsList from 'ui/internalTxs/InternalTxsList';
import InternalTxsTable from 'ui/internalTxs/InternalTxsTable';
import ActionBar from 'ui/shared/ActionBar';
import DataListDisplay from 'ui/shared/DataListDisplay';
import PageTitle from 'ui/shared/Page/PageTitle';
import Pagination from 'ui/shared/pagination/Pagination';
import useQueryWithPages from 'ui/shared/pagination/useQueryWithPages';

const InternalTxs = () => {
  const isMobile = useIsMobile();

  const { isError, isPlaceholderData, data, pagination } = useQueryWithPages({
    resourceName: 'internal_txs',
    options: {
      placeholderData: generateListStub<'internal_txs'>(
        INTERNAL_TX,
        50,
        {
          next_page_params: {
            items_count: 50,
            block_number: 1,
            index: 1,
            transaction_hash: '0x123',
            transaction_index: 1,
          },
        },
      ),
    },
  });

  const actionBar = (!isMobile || pagination.isVisible) ? (
    <ActionBar mt={ -6 }>
      <Pagination ml="auto" { ...pagination }/>
    </ActionBar>
  ) : null;

  const content = data?.items ? (
    <>
      <Show below="lg" ssr={ false }>
        <InternalTxsList data={ data.items } isLoading={ isPlaceholderData }/>
      </Show>
      <Hide below="lg" ssr={ false }>
        <InternalTxsTable data={ data.items } isLoading={ isPlaceholderData }/>
      </Hide>
    </>
  ) : null;

  return (
    <>
      <PageTitle
        title="Internal transactions"
        withTextAd
      />
      <DataListDisplay
        isError={ isError }
        items={ data?.items }
        emptyText="There are no internal transactions."
        content={ content }
        actionBar={ actionBar }
      />
    </>
  );
};

export default InternalTxs;
