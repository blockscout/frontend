import { useRouter } from 'next/router';
import React from 'react';

import type { AddressFromToFilter } from 'types/api/address';
import { AddressFromToFilterValues } from 'types/api/address';
import type { TransactionsSortingField, TransactionsSortingValue, TransactionsSorting } from 'types/api/transaction';

import getFilterValueFromQuery from 'lib/getFilterValueFromQuery';
import useIsMobile from 'lib/hooks/useIsMobile';
import useIsMounted from 'lib/hooks/useIsMounted';
import getQueryParamString from 'lib/router/getQueryParamString';
import { TX } from 'stubs/tx';
import { generateListStub } from 'stubs/utils';
import ActionBar, { ACTION_BAR_HEIGHT_DESKTOP } from 'ui/shared/ActionBar';
import Pagination from 'ui/shared/pagination/Pagination';
import useQueryWithPages from 'ui/shared/pagination/useQueryWithPages';
import getSortParamsFromValue from 'ui/shared/sort/getSortParamsFromValue';
import getSortValueFromQuery from 'ui/shared/sort/getSortValueFromQuery';
import TxsWithAPISorting from 'ui/txs/TxsWithAPISorting';
import { SORT_OPTIONS } from 'ui/txs/useTxsSort';

import AddressCsvExportLink from './AddressCsvExportLink';
import AddressTxsFilter from './AddressTxsFilter';

const getFilterValue = (getFilterValueFromQuery<AddressFromToFilter>).bind(null, AddressFromToFilterValues);

type Props = {
  shouldRender?: boolean;
  isQueryEnabled?: boolean;
};

const AddressTxs = ({ shouldRender = true, isQueryEnabled = true }: Props) => {
  const router = useRouter();
  const isMounted = useIsMounted();

  const [ sort, setSort ] = React.useState<TransactionsSortingValue>(getSortValueFromQuery<TransactionsSortingValue>(router.query, SORT_OPTIONS) || 'default');

  const isMobile = useIsMobile();
  const currentAddress = getQueryParamString(router.query.hash);

  const initialFilterValue = getFilterValue(router.query.filter);
  const [ filterValue, setFilterValue ] = React.useState<AddressFromToFilter>(initialFilterValue);

  const addressTxsQuery = useQueryWithPages({
    resourceName: 'general:address_txs',
    pathParams: { hash: currentAddress },
    filters: { filter: filterValue },
    sorting: getSortParamsFromValue<TransactionsSortingValue, TransactionsSortingField, TransactionsSorting['order']>(sort),
    options: {
      enabled: isQueryEnabled,
      placeholderData: generateListStub<'general:address_txs'>(TX, 50, { next_page_params: {
        block_number: 9005713,
        index: 5,
        items_count: 50,
      } }),
    },
  });

  const handleFilterChange = React.useCallback((val: string | Array<string>) => {

    const newVal = getFilterValue(val);
    setFilterValue(newVal);
    addressTxsQuery.onFilterChange({ filter: newVal });
  }, [ addressTxsQuery ]);

  if (!isMounted || !shouldRender) {
    return null;
  }

  const filter = (
    <AddressTxsFilter
      initialValue={ initialFilterValue }
      onFilterChange={ handleFilterChange }
      hasActiveFilter={ Boolean(filterValue) }
      isLoading={ addressTxsQuery.pagination.isLoading }
    />
  );

  const csvExportLink = (
    <AddressCsvExportLink
      address={ currentAddress }
      params={{ type: 'transactions', filterType: 'address', filterValue }}
      ml="auto"
      isLoading={ addressTxsQuery.pagination.isLoading }
    />
  );

  return (
    <>
      { !isMobile && (
        <ActionBar>
          { filter }
          { currentAddress && csvExportLink }
          <Pagination { ...addressTxsQuery.pagination } ml={ 8 }/>
        </ActionBar>
      ) }
      <TxsWithAPISorting
        filter={ filter }
        filterValue={ filterValue }
        query={ addressTxsQuery }
        currentAddress={ typeof currentAddress === 'string' ? currentAddress : undefined }
        enableTimeIncrement
        socketType="address_txs"
        top={ ACTION_BAR_HEIGHT_DESKTOP }
        sorting={ sort }
        setSort={ setSort }
      />
    </>
  );
};

export default AddressTxs;
