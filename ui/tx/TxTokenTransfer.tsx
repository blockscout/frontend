import { Hide, Show, Text } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import type { TokenType } from 'types/api/tokenInfo';

import { SECOND } from 'lib/consts';
import getFilterValuesFromQuery from 'lib/getFilterValuesFromQuery';
import useQueryWithPages from 'lib/hooks/useQueryWithPages';
import { apos } from 'lib/html-entities';
import TOKEN_TYPE from 'lib/token/tokenTypes';
import EmptySearchResult from 'ui/apps/EmptySearchResult';
import ActionBar from 'ui/shared/ActionBar';
import DataFetchAlert from 'ui/shared/DataFetchAlert';
import Pagination from 'ui/shared/Pagination';
import SkeletonList from 'ui/shared/skeletons/SkeletonList';
import SkeletonTable from 'ui/shared/skeletons/SkeletonTable';
import { flattenTotal } from 'ui/shared/TokenTransfer/helpers';
import TokenTransferFilter from 'ui/shared/TokenTransfer/TokenTransferFilter';
import TokenTransferList from 'ui/shared/TokenTransfer/TokenTransferList';
import TokenTransferTable from 'ui/shared/TokenTransfer/TokenTransferTable';
import TxPendingAlert from 'ui/tx/TxPendingAlert';
import TxSocketAlert from 'ui/tx/TxSocketAlert';
import useFetchTxInfo from 'ui/tx/useFetchTxInfo';

const TOKEN_TYPES = TOKEN_TYPE.map(i => i.id);

const getTokenFilterValue = (getFilterValuesFromQuery<TokenType>).bind(null, TOKEN_TYPES);

const TxTokenTransfer = () => {
  const txsInfo = useFetchTxInfo({ updateDelay: 5 * SECOND });

  const router = useRouter();

  const [ typeFilter, setTypeFilter ] = React.useState<Array<TokenType>>(getTokenFilterValue(router.query.type) || []);

  const tokenTransferQuery = useQueryWithPages({
    resourceName: 'tx_token_transfers',
    pathParams: { id: txsInfo.data?.hash.toString() },
    options: { enabled: Boolean(txsInfo.data?.status && txsInfo.data?.hash) },
    filters: { type: typeFilter },
  });

  const handleTypeFilterChange = React.useCallback((nextValue: Array<TokenType>) => {
    tokenTransferQuery.onFilterChange({ type: nextValue });
    setTypeFilter(nextValue);
  }, [ tokenTransferQuery ]);

  if (!txsInfo.isLoading && !txsInfo.isError && !txsInfo.data.status) {
    return txsInfo.socketStatus ? <TxSocketAlert status={ txsInfo.socketStatus }/> : <TxPendingAlert/>;
  }

  if (txsInfo.isError || tokenTransferQuery.isError) {
    return <DataFetchAlert/>;
  }

  const numActiveFilters = typeFilter.length;
  const isActionBarHidden = !numActiveFilters && !tokenTransferQuery.data?.items.length;

  const content = (() => {
    if (txsInfo.isLoading || tokenTransferQuery.isLoading) {
      return (
        <>
          <Hide below="lg" ssr={ false }>
            <SkeletonTable columns={ [ '185px', '25%', '25%', '25%', '25%' ] }
            />
          </Hide>
          <Show below="lg" ssr={ false }>
            <SkeletonList/>
          </Show>
        </>
      );
    }

    if (!tokenTransferQuery.data.items?.length && !numActiveFilters) {
      return <Text as="span">There are no token transfers</Text>;
    }

    if (!tokenTransferQuery.data.items?.length) {
      return <EmptySearchResult text={ `Couldn${ apos }t find any token transfer that matches your query.` }/>;
    }

    const items = tokenTransferQuery.data.items.reduce(flattenTotal, []);
    return (
      <>
        <Hide below="lg" ssr={ false }>
          <TokenTransferTable data={ items } top={ 80 }/>
        </Hide>
        <Show below="lg" ssr={ false }>
          <TokenTransferList data={ items }/>
        </Show>
      </>
    );
  })();

  return (
    <>
      { !isActionBarHidden && (
        <ActionBar mt={ -6 }>
          <TokenTransferFilter
            defaultTypeFilters={ typeFilter }
            onTypeFilterChange={ handleTypeFilterChange }
            appliedFiltersNum={ numActiveFilters }
          />
          { tokenTransferQuery.isPaginationVisible && <Pagination ml="auto" { ...tokenTransferQuery.pagination }/> }
        </ActionBar>
      ) }
      { content }
    </>
  );
};

export default TxTokenTransfer;
