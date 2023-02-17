import { Text, Show, Hide } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import type { AddressFromToFilter } from 'types/api/address';
import { AddressFromToFilterValues } from 'types/api/address';

import getFilterValueFromQuery from 'lib/getFilterValueFromQuery';
import useQueryWithPages from 'lib/hooks/useQueryWithPages';
import { apos } from 'lib/html-entities';
import getQueryParamString from 'lib/router/getQueryParamString';
import AddressIntTxsSkeletonDesktop from 'ui/address/internals/AddressIntTxsSkeletonDesktop';
import AddressIntTxsSkeletonMobile from 'ui/address/internals/AddressIntTxsSkeletonMobile';
import AddressIntTxsTable from 'ui/address/internals/AddressIntTxsTable';
import EmptySearchResult from 'ui/apps/EmptySearchResult';
import ActionBar from 'ui/shared/ActionBar';
import DataFetchAlert from 'ui/shared/DataFetchAlert';
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

  if (isLoading) {
    return (
      <>
        <Show below="lg" ssr={ false }><AddressIntTxsSkeletonMobile/></Show>
        <Hide below="lg" ssr={ false }><AddressIntTxsSkeletonDesktop/></Hide>
      </>
    );
  }

  if (isError) {
    return <DataFetchAlert/>;
  }

  if (data.items.length === 0 && !filterValue) {
    return <Text as="span">There are no internal transactions for this address.</Text>;
  }

  let content;

  if (data.items.length === 0) {
    content = <EmptySearchResult text={ `Couldn${ apos }t find any transaction that matches your query.` }/>;
  } else {
    content = (
      <>
        <Show below="lg" ssr={ false }>
          <AddressIntTxsList data={ data.items } currentAddress={ hash }/>
        </Show>
        <Hide below="lg" ssr={ false }>
          <AddressIntTxsTable data={ data.items } currentAddress={ hash }/>
        </Hide>
      </>
    );
  }

  return (
    <>
      <ActionBar mt={ -6 } justifyContent="left">
        <AddressTxsFilter
          defaultFilter={ filterValue }
          onFilterChange={ handleFilterChange }
          isActive={ Boolean(filterValue) }
        />
        <AddressCsvExportLink address={ hash } type="internal-transactions" ml={{ base: 2, lg: 'auto' }}/>
        { isPaginationVisible && <Pagination ml={{ base: 'auto', lg: 8 }} { ...pagination }/> }
      </ActionBar>
      { content }
    </>
  );
};

export default AddressInternalTxs;
