import castArray from 'lodash/castArray';
import { useRouter } from 'next/router';
import React from 'react';

import type { AddressFromToFilter } from 'types/api/address';
import { AddressFromToFilterValues } from 'types/api/address';

import getFilterValueFromQuery from 'lib/getFilterValueFromQuery';
import useIsMobile from 'lib/hooks/useIsMobile';
import useQueryWithPages from 'lib/hooks/useQueryWithPages';
import ActionBar from 'ui/shared/ActionBar';
import Pagination from 'ui/shared/Pagination';
import TxsContent from 'ui/txs/TxsContent';

import AddressTxsFilter from './AddressTxsFilter';

const getFilterValue = (getFilterValueFromQuery<AddressFromToFilter>).bind(null, AddressFromToFilterValues);

const AddressTxs = ({ scrollRef }: {scrollRef?: React.RefObject<HTMLDivElement>}) => {
  const router = useRouter();

  const isMobile = useIsMobile();

  const [ filterValue, setFilterValue ] = React.useState<AddressFromToFilter>(getFilterValue(router.query.filter));

  const addressTxsQuery = useQueryWithPages({
    resourceName: 'address_txs',
    pathParams: { id: castArray(router.query.id)[0] },
    filters: { filter: filterValue },
    scrollRef,
  });

  const handleFilterChange = React.useCallback((val: string | Array<string>) => {

    const newVal = getFilterValue(val);
    setFilterValue(newVal);
    addressTxsQuery.onFilterChange({ filter: newVal });
  }, [ addressTxsQuery ]);

  const filter = (
    <AddressTxsFilter
      defaultFilter={ filterValue }
      onFilterChange={ handleFilterChange }
      isActive={ Boolean(filterValue) }
    />
  );

  return (
    <>
      { !isMobile && (
        <ActionBar mt={ -6 }>
          { filter }
          { addressTxsQuery.isPaginationVisible && <Pagination { ...addressTxsQuery.pagination }/> }
        </ActionBar>
      ) }
      <TxsContent
        filter={ filter }
        query={ addressTxsQuery }
        showSocketInfo={ false }
        currentAddress={ typeof router.query.id === 'string' ? router.query.id : undefined }
        enableTimeIncrement
      />
    </>
  );
};

export default AddressTxs;
