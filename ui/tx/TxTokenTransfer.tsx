import { Hide, Show } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import type { TokenType } from 'types/api/token';

import { SECOND } from 'lib/consts';
import getFilterValuesFromQuery from 'lib/getFilterValuesFromQuery';
import { apos } from 'lib/html-entities';
import { TOKEN_TYPE_IDS } from 'lib/token/tokenTypes';
import { getTokenTransfersStub } from 'stubs/token';
import ActionBar from 'ui/shared/ActionBar';
import DataFetchAlert from 'ui/shared/DataFetchAlert';
import DataListDisplay from 'ui/shared/DataListDisplay';
import Pagination from 'ui/shared/pagination/Pagination';
import useQueryWithPages from 'ui/shared/pagination/useQueryWithPages';
import TokenTransferFilter from 'ui/shared/TokenTransfer/TokenTransferFilter';
import TokenTransferList from 'ui/shared/TokenTransfer/TokenTransferList';
import TokenTransferTable from 'ui/shared/TokenTransfer/TokenTransferTable';
import TxPendingAlert from 'ui/tx/TxPendingAlert';
import TxSocketAlert from 'ui/tx/TxSocketAlert';
import useFetchTxInfo from 'ui/tx/useFetchTxInfo';

const getTokenFilterValue = (getFilterValuesFromQuery<TokenType>).bind(null, TOKEN_TYPE_IDS);

const TxTokenTransfer = () => {
  const txsInfo = useFetchTxInfo({ updateDelay: 5 * SECOND });

  const router = useRouter();

  const [ typeFilter, setTypeFilter ] = React.useState<Array<TokenType>>(getTokenFilterValue(router.query.type) || []);

  const tokenTransferQuery = useQueryWithPages({
    resourceName: 'tx_token_transfers',
    pathParams: { hash: txsInfo.data?.hash.toString() },
    options: {
      enabled: !txsInfo.isPlaceholderData && Boolean(txsInfo.data?.status && txsInfo.data?.hash),
      placeholderData: getTokenTransfersStub(),
    },
    filters: { type: typeFilter },
  });

  const handleTypeFilterChange = React.useCallback((nextValue: Array<TokenType>) => {
    tokenTransferQuery.onFilterChange({ type: nextValue });
    setTypeFilter(nextValue);
  }, [ tokenTransferQuery ]);

  if (!txsInfo.isPending && !txsInfo.isPlaceholderData && !txsInfo.isError && !txsInfo.data.status) {
    return txsInfo.socketStatus ? <TxSocketAlert status={ txsInfo.socketStatus }/> : <TxPendingAlert/>;
  }

  if (txsInfo.isError || tokenTransferQuery.isError) {
    return <DataFetchAlert/>;
  }

  const numActiveFilters = typeFilter.length;
  const isActionBarHidden = !numActiveFilters && !tokenTransferQuery.data?.items.length;

  const content = tokenTransferQuery.data?.items ? (
    <>
      <Hide below="lg" ssr={ false }>
        <TokenTransferTable data={ tokenTransferQuery.data?.items } top={ isActionBarHidden ? 0 : 80 } isLoading={ tokenTransferQuery.isPlaceholderData }/>
      </Hide>
      <Show below="lg" ssr={ false }>
        <TokenTransferList data={ tokenTransferQuery.data?.items } isLoading={ tokenTransferQuery.isPlaceholderData }/>
      </Show>
    </>
  ) : null;

  const actionBar = !isActionBarHidden ? (
    <ActionBar mt={ -6 }>
      <TokenTransferFilter
        defaultTypeFilters={ typeFilter }
        onTypeFilterChange={ handleTypeFilterChange }
        appliedFiltersNum={ numActiveFilters }
        isLoading={ tokenTransferQuery.isPlaceholderData }
      />
      <Pagination ml="auto" { ...tokenTransferQuery.pagination }/>
    </ActionBar>
  ) : null;

  return (
    <DataListDisplay
      isError={ txsInfo.isError || tokenTransferQuery.isError }
      items={ tokenTransferQuery.data?.items }
      emptyText="There are no token transfers."
      filterProps={{
        emptyFilteredText: `Couldn${ apos }t find any token transfer that matches your query.`,
        hasActiveFilters: Boolean(numActiveFilters),
      }}
      content={ content }
      actionBar={ actionBar }
    />
  );
};

export default TxTokenTransfer;
