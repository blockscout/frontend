import { Show, Hide } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import type { AddressFromToFilter } from 'types/api/address';
import { AddressFromToFilterValues } from 'types/api/address';

import getFilterValueFromQuery from 'lib/getFilterValueFromQuery';
import useQueryWithPages from 'lib/hooks/useQueryWithPages';
import { apos } from 'lib/html-entities';
import getQueryParamString from 'lib/router/getQueryParamString';
import AddressIntTxsTable from 'ui/address/internals/AddressIntTxsTable';
import ActionBar from 'ui/shared/ActionBar';
import DataListDisplay from 'ui/shared/DataListDisplay';
import Pagination from 'ui/shared/Pagination';

import AddressCsvExportLink from './AddressCsvExportLink';
import AddressTxsFilter from './AddressTxsFilter';
import AddressIntTxsList from './internals/AddressIntTxsList';

const getFilterValue = (getFilterValueFromQuery<AddressFromToFilter>).bind(null, AddressFromToFilterValues);

const AddressInternalTxs = ({ scrollRef }: {scrollRef?: React.RefObject<HTMLDivElement>}) => {
  const router = useRouter();
  const [ filterValue, setFilterValue ] = React.useState<AddressFromToFilter>(getFilterValue(router.query.filter));

  const hash = getQueryParamString(router.query.hash);

  const { data, isLoading, isError, pagination, onFilterChange, isPaginationVisible } = useQueryWithPages({
    resourceName: 'address_internal_txs',
    pathParams: { hash },
    filters: { filter: filterValue },
    scrollRef,
  });

  const handleFilterChange = React.useCallback((val: string | Array<string>) => {

    const newVal = getFilterValue(val);
    setFilterValue(newVal);
    onFilterChange({ filter: newVal });
  }, [ onFilterChange ]);

  const content = data?.items ? (
    <>
      <Show below="lg" ssr={ false }>
        <AddressIntTxsList data={ data.items } currentAddress={ hash }/>
      </Show>
      <Hide below="lg" ssr={ false }>
        <AddressIntTxsTable data={ data.items } currentAddress={ hash }/>
      </Hide>
    </>
  ) : null ;

  const actionBar = (
    <ActionBar mt={ -6 } justifyContent="left" showShadow={ isLoading }>
      <AddressTxsFilter
        defaultFilter={ filterValue }
        onFilterChange={ handleFilterChange }
        isActive={ Boolean(filterValue) }
      />
      <AddressCsvExportLink address={ hash } type="internal-transactions" ml={{ base: 2, lg: 'auto' }}/>
      { isPaginationVisible && <Pagination ml={{ base: 'auto', lg: 8 }} { ...pagination }/> }
    </ActionBar>
  );

  return (
    <DataListDisplay
      isError={ isError }
      isLoading={ isLoading }
      items={ data?.items }
      skeletonProps={{ isLongSkeleton: true, skeletonDesktopColumns: [ '15%', '15%', '10%', '20%', '20%', '20%' ] }}
      filterProps={{ emptyFilteredText: `Couldn${ apos }t find any transaction that matches your query.`, hasActiveFilters: Boolean(filterValue) }}
      emptyText="There are no internal transactions for this address."
      content={ content }
      actionBar={ actionBar }
    />
  );
};

export default AddressInternalTxs;
