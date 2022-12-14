import { Hide, Show, Text } from '@chakra-ui/react';
import React from 'react';

import type { TokenType } from 'types/api/tokenInfo';
import type { QueryKeys } from 'types/client/queries';

import useQueryWithPages from 'lib/hooks/useQueryWithPages';
import { apos } from 'lib/html-entities';
import EmptySearchResult from 'ui/apps/EmptySearchResult';
import ActionBar from 'ui/shared/ActionBar';
import DataFetchAlert from 'ui/shared/DataFetchAlert';
import Pagination from 'ui/shared/Pagination';
import SkeletonTable from 'ui/shared/SkeletonTable';
import { flattenTotal } from 'ui/shared/TokenTransfer/helpers';
import TokenTransferFilter from 'ui/shared/TokenTransfer/TokenTransferFilter';
import TokenTransferList from 'ui/shared/TokenTransfer/TokenTransferList';
import TokenTransferSkeletonMobile from 'ui/shared/TokenTransfer/TokenTransferSkeletonMobile';
import TokenTransferTable from 'ui/shared/TokenTransfer/TokenTransferTable';

interface Props {
  isLoading?: boolean;
  isDisabled?: boolean;
  path: string;
  queryName: QueryKeys.txTokenTransfers;
  queryIds?: Array<string>;
  baseAddress?: string;
  showTxInfo?: boolean;
  txHash?: string;
}

const TokenTransfer = ({ isLoading: isLoadingProp, isDisabled, queryName, queryIds, path, baseAddress, showTxInfo = true }: Props) => {
  const [ filters, setFilters ] = React.useState<Array<TokenType>>([]);
  const { isError, isLoading, data, pagination } = useQueryWithPages({
    apiPath: path,
    queryName,
    queryIds,
    options: { enabled: !isDisabled },
    filters: filters.length ? { type: filters } : undefined,
  });

  const handleFilterChange = React.useCallback((nextValue: Array<TokenType>) => {
    setFilters(nextValue);
  }, []);

  const isActionBarHidden = filters.length === 0 && !data?.items.length;

  const content = (() => {
    if (isLoading || isLoadingProp) {
      return (
        <>
          <Hide below="lg">
            <SkeletonTable columns={ showTxInfo ?
              [ '44px', '185px', '160px', '25%', '25%', '25%', '25%' ] :
              [ '185px', '25%', '25%', '25%', '25%' ] }
            />
          </Hide>
          <Show below="lg">
            <TokenTransferSkeletonMobile showTxInfo={ showTxInfo }/>
          </Show>
        </>
      );
    }

    if (isError) {
      return <DataFetchAlert/>;
    }

    if (!data.items?.length && filters.length === 0) {
      return <Text as="span">There are no token transfers</Text>;
    }

    if (!data.items?.length) {
      return <EmptySearchResult text={ `Couldn${ apos }t find any token transfer that matches your query.` }/>;
    }

    const items = data.items.reduce(flattenTotal, []);
    return (
      <>
        <Hide below="lg">
          <TokenTransferTable data={ items } baseAddress={ baseAddress } showTxInfo={ showTxInfo } top={ 80 }/>
        </Hide>
        <Show below="lg">
          <TokenTransferList data={ items } baseAddress={ baseAddress } showTxInfo={ showTxInfo }/>
        </Show>
      </>
    );
  })();

  return (
    <>
      { !isActionBarHidden && (
        <ActionBar mt={ -6 }>
          <TokenTransferFilter defaultFilters={ filters } onFilterChange={ handleFilterChange } appliedFiltersNum={ filters.length }/>
          <Pagination ml="auto" { ...pagination }/>
        </ActionBar>
      ) }
      { content }
    </>
  );
};

export default React.memo(TokenTransfer);
