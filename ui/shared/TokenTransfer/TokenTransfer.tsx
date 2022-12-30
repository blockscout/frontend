import { Hide, Show, Text } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';
import { Element } from 'react-scroll';

import type { AddressFromToFilter } from 'types/api/address';
import { AddressFromToFilterValues } from 'types/api/address';
import type { TokenType } from 'types/api/tokenInfo';

import type { PaginationFilters } from 'lib/api/resources';
import type { Params as UseApiQueryParams } from 'lib/api/useApiQuery';
import getFilterValueFromQuery from 'lib/getFilterValueFromQuery';
import getFilterValuesFromQuery from 'lib/getFilterValuesFromQuery';
import useQueryWithPages from 'lib/hooks/useQueryWithPages';
import { apos } from 'lib/html-entities';
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

import { TOKEN_TYPE } from './helpers';

const TOKEN_TYPES = TOKEN_TYPE.map(i => i.id);

const SCROLL_ELEM = 'token-transfers';
const SCROLL_OFFSET = -100;

const getTokenFilterValue = (getFilterValuesFromQuery<TokenType>).bind(null, TOKEN_TYPES);
const getAddressFilterValue = (getFilterValueFromQuery<AddressFromToFilter>).bind(null, AddressFromToFilterValues);

interface Props<Resource extends 'tx_token_transfers' | 'address_token_transfers'> {
  isLoading?: boolean;
  isDisabled?: boolean;
  resourceName: Resource;
  baseAddress?: string;
  showTxInfo?: boolean;
  txHash?: string;
  enableTimeIncrement?: boolean;
  pathParams?: UseApiQueryParams<Resource>['pathParams'];
}

type State = {
  type: Array<TokenType> | undefined;
  filter: AddressFromToFilter;
}

const TokenTransfer = <Resource extends 'tx_token_transfers' | 'address_token_transfers'>({
  isLoading: isLoadingProp,
  isDisabled,
  resourceName,
  baseAddress,
  showTxInfo = true,
  enableTimeIncrement,
  pathParams,
}: Props<Resource>) => {
  const router = useRouter();
  const [ filters, setFilters ] = React.useState<State>(
    { type: getTokenFilterValue(router.query.type), filter: getAddressFilterValue(router.query.filter) },
  );

  const { isError, isLoading, data, pagination, onFilterChange, isPaginationVisible } = useQueryWithPages({
    resourceName,
    pathParams,
    options: { enabled: !isDisabled },
    filters: filters as PaginationFilters<Resource>,
    scroll: { elem: SCROLL_ELEM, offset: SCROLL_OFFSET },
  });

  const handleTypeFilterChange = React.useCallback((nextValue: Array<TokenType>) => {
    onFilterChange({ ...filters, type: nextValue } as PaginationFilters<Resource>);
    setFilters((prevState) => ({ ...prevState, type: nextValue }));
  }, [ filters, onFilterChange ]);

  const handleAddressFilterChange = React.useCallback((nextValue: string) => {
    const filterVal = getAddressFilterValue(nextValue);
    onFilterChange({ ...filters, filter: filterVal } as PaginationFilters<Resource>);
    setFilters((prevState) => ({ ...prevState, filter: filterVal }));
  }, [ filters, onFilterChange ]);

  const numActiveFilters = (filters.type?.length || 0) + (filters.filter ? 1 : 0);
  const isActionBarHidden = !numActiveFilters && !data?.items.length;

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
            <SkeletonList/>
          </Show>
        </>
      );
    }

    if (isError) {
      return <DataFetchAlert/>;
    }

    if (!data.items?.length && !numActiveFilters) {
      return <Text as="span">There are no token transfers</Text>;
    }

    if (!data.items?.length) {
      return <EmptySearchResult text={ `Couldn${ apos }t find any token transfer that matches your query.` }/>;
    }

    const items = data.items.reduce(flattenTotal, []);
    return (
      <>
        <Hide below="lg">
          <TokenTransferTable data={ items } baseAddress={ baseAddress } showTxInfo={ showTxInfo } top={ 80 } enableTimeIncrement={ enableTimeIncrement }/>
        </Hide>
        <Show below="lg">
          <TokenTransferList data={ items } baseAddress={ baseAddress } showTxInfo={ showTxInfo } enableTimeIncrement={ enableTimeIncrement }/>
        </Show>
      </>
    );
  })();

  return (
    <Element name={ SCROLL_ELEM }>
      { !isActionBarHidden && (
        <ActionBar mt={ -6 }>
          <TokenTransferFilter
            defaultTypeFilters={ filters.type }
            onTypeFilterChange={ handleTypeFilterChange }
            appliedFiltersNum={ numActiveFilters }
            withAddressFilter={ Boolean(baseAddress) }
            onAddressFilterChange={ handleAddressFilterChange }
            defaultAddressFilter={ filters.filter }
          />
          { isPaginationVisible && <Pagination ml="auto" { ...pagination }/> }
        </ActionBar>
      ) }
      { content }
    </Element>
  );
};

export default React.memo(TokenTransfer);
