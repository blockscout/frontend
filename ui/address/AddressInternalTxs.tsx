import { Text, Show, Hide } from '@chakra-ui/react';
import castArray from 'lodash/castArray';
import { useRouter } from 'next/router';
import React from 'react';
import { Element } from 'react-scroll';

import type { AddressFromToFilter } from 'types/api/address';
import { AddressFromToFilterValues } from 'types/api/address';

import getFilterValueFromQuery from 'lib/getFilterValueFromQuery';
import useQueryWithPages from 'lib/hooks/useQueryWithPages';
import { apos } from 'lib/html-entities';
import AddressIntTxsSkeletonDesktop from 'ui/address/internals/AddressIntTxsSkeletonDesktop';
import AddressIntTxsSkeletonMobile from 'ui/address/internals/AddressIntTxsSkeletonMobile';
import AddressIntTxsTable from 'ui/address/internals/AddressIntTxsTable';
import EmptySearchResult from 'ui/apps/EmptySearchResult';
import ActionBar from 'ui/shared/ActionBar';
import DataFetchAlert from 'ui/shared/DataFetchAlert';
import Pagination from 'ui/shared/Pagination';

import AddressTxsFilter from './AddressTxsFilter';
import AddressIntTxsList from './internals/AddressIntTxsList';

const SCROLL_ELEM = 'address-internas-txs';
const SCROLL_OFFSET = -100;

const getFilterValue = (getFilterValueFromQuery<AddressFromToFilter>).bind(null, AddressFromToFilterValues);

const AddressInternalTxs = () => {
  const router = useRouter();
  const [ filterValue, setFilterValue ] = React.useState<AddressFromToFilter>(getFilterValue(router.query.filter));

  const queryId = router.query.id;
  const queryIdArray = castArray(queryId);
  const queryIdStr = queryIdArray[0];

  const { data, isLoading, isError, pagination, onFilterChange, isPaginationVisible } = useQueryWithPages({
    resourceName: 'address_internal_txs',
    pathParams: { id: queryIdStr },
    filters: { filter: filterValue },
    scroll: { elem: SCROLL_ELEM, offset: SCROLL_OFFSET },
  });

  const handleFilterChange = React.useCallback((val: string | Array<string>) => {

    const newVal = getFilterValue(val);
    setFilterValue(newVal);
    onFilterChange({ filter: newVal });
  }, [ onFilterChange ]);

  if (isLoading) {
    return (
      <>
        <Show below="lg"><AddressIntTxsSkeletonMobile/></Show>
        <Hide below="lg"><AddressIntTxsSkeletonDesktop/></Hide>
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
          <AddressIntTxsList data={ data.items } currentAddress={ queryIdStr }/>
        </Show>
        <Hide below="lg" ssr={ false }>
          <AddressIntTxsTable data={ data.items } currentAddress={ queryIdStr }/>
        </Hide>
      </>
    );
  }

  return (
    <Element name={ SCROLL_ELEM }>
      <ActionBar mt={ -6 }>
        <AddressTxsFilter
          defaultFilter={ filterValue }
          onFilterChange={ handleFilterChange }
          isActive={ Boolean(filterValue) }
        />
        { isPaginationVisible && <Pagination ml="auto" { ...pagination }/> }
      </ActionBar>
      { content }
    </Element>
  );
};

export default AddressInternalTxs;
