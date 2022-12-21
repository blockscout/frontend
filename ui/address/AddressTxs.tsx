import castArray from 'lodash/castArray';
import { useRouter } from 'next/router';
import React from 'react';
import { Element } from 'react-scroll';

import type { AddressFromToFilter } from 'types/api/address';
import { AddressFromToFilterValues } from 'types/api/address';
import { QueryKeys } from 'types/client/queries';

import getFilterValueFromQuery from 'lib/getFilterValueFromQuery';
import useIsMobile from 'lib/hooks/useIsMobile';
import useQueryWithPages from 'lib/hooks/useQueryWithPages';
import ActionBar from 'ui/shared/ActionBar';
import Pagination from 'ui/shared/Pagination';
import TxsContent from 'ui/txs/TxsContent';

import AddressTxsFilter from './AddressTxsFilter';

const getFilterValue = (getFilterValueFromQuery<AddressFromToFilter>).bind(null, AddressFromToFilterValues);

const SCROLL_ELEM = 'address-txs';
const SCROLL_OFFSET = -100;

const AddressTxs = () => {
  const router = useRouter();

  const isMobile = useIsMobile();

  const [ filterValue, setFilterValue ] = React.useState<AddressFromToFilter>(getFilterValue(router.query.filter));

  const addressTxsQuery = useQueryWithPages({
    apiPath: `/node-api/addresses/${ router.query.id }/transactions`,
    queryName: QueryKeys.addressTxs,
    queryIds: castArray(router.query.id),
    filters: { filter: filterValue },
    scroll: { elem: SCROLL_ELEM, offset: SCROLL_OFFSET },
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
    <Element name={ SCROLL_ELEM }>
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
    </Element>
  );
};

export default AddressTxs;
