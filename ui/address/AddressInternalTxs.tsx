import { Show, Hide } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import type { AddressFromToFilter } from 'types/api/address';
import { AddressFromToFilterValues } from 'types/api/address';

import getFilterValueFromQuery from 'lib/getFilterValueFromQuery';
import useIsMounted from 'lib/hooks/useIsMounted';
import { apos } from 'lib/html-entities';
import getQueryParamString from 'lib/router/getQueryParamString';
import { INTERNAL_TX } from 'stubs/internalTx';
import { generateListStub } from 'stubs/utils';
import AddressIntTxsTable from 'ui/address/internals/AddressIntTxsTable';
import ActionBar from 'ui/shared/ActionBar';
import DataListDisplay from 'ui/shared/DataListDisplay';
import Pagination from 'ui/shared/pagination/Pagination';
import useQueryWithPages from 'ui/shared/pagination/useQueryWithPages';

import AddressCsvExportLink from './AddressCsvExportLink';
import AddressTxsFilter from './AddressTxsFilter';
import AddressIntTxsList from './internals/AddressIntTxsList';

const getFilterValue = (getFilterValueFromQuery<AddressFromToFilter>).bind(null, AddressFromToFilterValues);

type Props = {
  scrollRef?: React.RefObject<HTMLDivElement>;
  shouldRender?: boolean;
  isQueryEnabled?: boolean;
};
const AddressInternalTxs = ({ scrollRef, shouldRender = true, isQueryEnabled = true }: Props) => {
  const router = useRouter();
  const isMounted = useIsMounted();

  const [ filterValue, setFilterValue ] = React.useState<AddressFromToFilter>(getFilterValue(router.query.filter));

  const hash = getQueryParamString(router.query.hash);

  const { data, isPlaceholderData, isError, pagination, onFilterChange } = useQueryWithPages({
    resourceName: 'address_internal_txs',
    pathParams: { hash },
    filters: { filter: filterValue },
    scrollRef,
    options: {
      enabled: isQueryEnabled,
      placeholderData: generateListStub<'address_internal_txs'>(
        INTERNAL_TX,
        50,
        {
          next_page_params: {
            block_number: 8987561,
            index: 2,
            items_count: 50,
            transaction_index: 67,
          },
        },
      ),
    },
  });

  const handleFilterChange = React.useCallback((val: string | Array<string>) => {
    const newVal = getFilterValue(val);
    setFilterValue(newVal);
    onFilterChange({ filter: newVal });
  }, [ onFilterChange ]);

  if (!isMounted || !shouldRender) {
    return null;
  }

  const content = data?.items ? (
    <>
      <Show below="lg" ssr={ false }>
        <AddressIntTxsList data={ data.items } currentAddress={ hash } isLoading={ isPlaceholderData }/>
      </Show>
      <Hide below="lg" ssr={ false }>
        <AddressIntTxsTable data={ data.items } currentAddress={ hash } isLoading={ isPlaceholderData }/>
      </Hide>
    </>
  ) : null ;

  const actionBar = (
    <ActionBar mt={ -6 } justifyContent="left">
      <AddressTxsFilter
        defaultFilter={ filterValue }
        onFilterChange={ handleFilterChange }
        hasActiveFilter={ Boolean(filterValue) }
        isLoading={ pagination.isLoading }
      />
      <AddressCsvExportLink
        address={ hash }
        isLoading={ pagination.isLoading }
        params={{ type: 'internal-transactions', filterType: 'address', filterValue }}
        ml={{ base: 2, lg: 'auto' }}
      />
      <Pagination ml={{ base: 'auto', lg: 8 }} { ...pagination }/>
    </ActionBar>
  );

  return (
    <DataListDisplay
      isError={ isError }
      items={ data?.items }
      filterProps={{ emptyFilteredText: `Couldn${ apos }t find any transaction that matches your query.`, hasActiveFilters: Boolean(filterValue) }}
      emptyText="There are no internal transactions for this address."
      content={ content }
      actionBar={ actionBar }
    />
  );
};

export default AddressInternalTxs;
