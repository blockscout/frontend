import { Hide, Show } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import type { TokenType } from 'types/api/token';
import type { TokenTransfer } from 'types/api/tokenTransfer';

import getFilterValuesFromQuery from 'lib/getFilterValuesFromQuery';
import { apos } from 'lib/html-entities';
import { TOKEN_TYPE_IDS } from 'lib/token/tokenTypes';
import { getTokenTransfersStub } from 'stubs/token';
import ActionBar, { ACTION_BAR_HEIGHT_DESKTOP } from 'ui/shared/ActionBar';
import DataFetchAlert from 'ui/shared/DataFetchAlert';
import DataListDisplay from 'ui/shared/DataListDisplay';
import Pagination from 'ui/shared/pagination/Pagination';
import useQueryWithPages from 'ui/shared/pagination/useQueryWithPages';
import TokenTransferFilter from 'ui/shared/TokenTransfer/TokenTransferFilter';
import TokenTransferList from 'ui/shared/TokenTransfer/TokenTransferList';
import TokenTransferTable from 'ui/shared/TokenTransfer/TokenTransferTable';
import TxPendingAlert from 'ui/tx/TxPendingAlert';
import TxSocketAlert from 'ui/tx/TxSocketAlert';

import type { TxQuery } from './useTxQuery';

const getTokenFilterValue = (getFilterValuesFromQuery<TokenType>).bind(null, TOKEN_TYPE_IDS);

interface Props {
  txQuery: TxQuery;
  tokenTransferFilter?: (data: TokenTransfer) => boolean;
}

const TxTokenTransfer = ({ txQuery, tokenTransferFilter }: Props) => {
  const router = useRouter();

  const [ typeFilter, setTypeFilter ] = React.useState<Array<TokenType>>(getTokenFilterValue(router.query.type) || []);

  const tokenTransferQuery = useQueryWithPages({
    resourceName: 'tx_token_transfers',
    pathParams: { hash: txQuery.data?.hash.toString() },
    options: {
      enabled: !txQuery.isPlaceholderData && Boolean(txQuery.data?.status && txQuery.data?.hash),
      placeholderData: getTokenTransfersStub(),
    },
    filters: { type: typeFilter },
  });

  const handleTypeFilterChange = React.useCallback((nextValue: Array<TokenType>) => {
    tokenTransferQuery.onFilterChange({ type: nextValue });
    setTypeFilter(nextValue);
  }, [ tokenTransferQuery ]);

  if (!txQuery.isPending && !txQuery.isPlaceholderData && !txQuery.isError && !txQuery.data.status) {
    return txQuery.socketStatus ? <TxSocketAlert status={ txQuery.socketStatus }/> : <TxPendingAlert/>;
  }

  if (txQuery.isError || tokenTransferQuery.isError) {
    return <DataFetchAlert/>;
  }

  const numActiveFilters = typeFilter.length;
  const isActionBarHidden = !numActiveFilters && !tokenTransferQuery.data?.items.length;

  let items: Array<TokenTransfer> = [];

  if (tokenTransferQuery.data?.items) {
    if (tokenTransferQuery.isPlaceholderData) {
      items = tokenTransferQuery.data?.items;
    } else {
      items = tokenTransferFilter ? tokenTransferQuery.data.items.filter(tokenTransferFilter) : tokenTransferQuery.data.items;
    }
  }

  const content = tokenTransferQuery.data?.items ? (
    <>
      <Hide below="lg" ssr={ false }>
        <TokenTransferTable data={ items } top={ isActionBarHidden ? 0 : ACTION_BAR_HEIGHT_DESKTOP } isLoading={ tokenTransferQuery.isPlaceholderData }/>
      </Hide>
      <Show below="lg" ssr={ false }>
        <TokenTransferList data={ items } isLoading={ tokenTransferQuery.isPlaceholderData }/>
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
      isError={ txQuery.isError || tokenTransferQuery.isError }
      items={ items }
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
