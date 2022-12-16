import { Hide, Show, Text } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';
import { Element } from 'react-scroll';

import type { AddressTokenTransferFilters, AddressFromToFilter } from 'types/api/address';
import { AddressFromToFilterValues } from 'types/api/address';
import type { TokenType } from 'types/api/tokenInfo';
import type { TokenTransferFilters } from 'types/api/tokenTransfer';
import type { QueryKeys } from 'types/client/queries';

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

interface Props {
  isLoading?: boolean;
  isDisabled?: boolean;
  path: string;
  queryName: QueryKeys.txTokenTransfers | QueryKeys.addressTokenTransfers;
  queryIds?: Array<string>;
  baseAddress?: string;
  showTxInfo?: boolean;
  txHash?: string;
}

const TokenTransfer = ({ isLoading: isLoadingProp, isDisabled, queryName, queryIds, path, baseAddress, showTxInfo = true }: Props) => {
  const router = useRouter();
  const [ filters, setFilters ] = React.useState<AddressTokenTransferFilters & TokenTransferFilters>(
    { type: getTokenFilterValue(router.query.type), filter: getAddressFilterValue(router.query.filter) },
  );

  const { isError, isLoading, data, pagination, onFilterChange } = useQueryWithPages({
    apiPath: path,
    queryName,
    queryIds,
    options: { enabled: !isDisabled },
    filters: filters,
    scroll: { elem: SCROLL_ELEM, offset: SCROLL_OFFSET },
  });

  const handleTypeFilterChange = React.useCallback((nextValue: Array<TokenType>) => {
    onFilterChange({ ...filters, type: nextValue });
    setFilters((prevState) => ({ ...prevState, type: nextValue }));
  }, [ filters, onFilterChange ]);

  const handleAddressFilterChange = React.useCallback((nextValue: string) => {
    const filterVal = getAddressFilterValue(nextValue);
    onFilterChange({ ...filters, filter: filterVal });
    setFilters((prevState) => ({ ...prevState, filter: filterVal }));
  }, [ filters, onFilterChange ]);

  const numActiveFilters = filters.type.length + (filters.filter ? 1 : 0);
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
          <TokenTransferTable data={ items } baseAddress={ baseAddress } showTxInfo={ showTxInfo } top={ 80 }/>
        </Hide>
        <Show below="lg">
          <TokenTransferList data={ items } baseAddress={ baseAddress } showTxInfo={ showTxInfo }/>
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
          <Pagination ml="auto" { ...pagination }/>
        </ActionBar>
      ) }
      { content }
    </Element>
  );
};

export default React.memo(TokenTransfer);
