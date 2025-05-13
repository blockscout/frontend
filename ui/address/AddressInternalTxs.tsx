import { Box } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import type { AddressFromToFilter } from 'types/api/address';
import { AddressFromToFilterValues } from 'types/api/address';

import getFilterValueFromQuery from 'lib/getFilterValueFromQuery';
import useIsMounted from 'lib/hooks/useIsMounted';
import getQueryParamString from 'lib/router/getQueryParamString';
import { INTERNAL_TX } from 'stubs/internalTx';
import { generateListStub } from 'stubs/utils';
import { apos } from 'toolkit/utils/htmlEntities';
import InternalTxsList from 'ui/internalTxs/InternalTxsList';
import InternalTxsTable from 'ui/internalTxs/InternalTxsTable';
import ActionBar from 'ui/shared/ActionBar';
import DataListDisplay from 'ui/shared/DataListDisplay';
import Pagination from 'ui/shared/pagination/Pagination';
import useQueryWithPages from 'ui/shared/pagination/useQueryWithPages';

import AddressCsvExportLink from './AddressCsvExportLink';
import AddressTxsFilter from './AddressTxsFilter';

const getFilterValue = (getFilterValueFromQuery<AddressFromToFilter>).bind(null, AddressFromToFilterValues);

type Props = {
  shouldRender?: boolean;
  isQueryEnabled?: boolean;
};
const AddressInternalTxs = ({ shouldRender = true, isQueryEnabled = true }: Props) => {
  const router = useRouter();
  const isMounted = useIsMounted();

  const [ filterValue, setFilterValue ] = React.useState<AddressFromToFilter>(getFilterValue(router.query.filter));

  const hash = getQueryParamString(router.query.hash);

  const { data, isPlaceholderData, isError, pagination, onFilterChange } = useQueryWithPages({
    resourceName: 'general:address_internal_txs',
    pathParams: { hash },
    filters: { filter: filterValue },
    options: {
      enabled: isQueryEnabled,
      placeholderData: generateListStub<'general:address_internal_txs'>(
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
      <Box hideFrom="lg">
        <InternalTxsList data={ data.items } currentAddress={ hash } isLoading={ isPlaceholderData }/>
      </Box>
      <Box hideBelow="lg">
        <InternalTxsTable data={ data.items } currentAddress={ hash } isLoading={ isPlaceholderData }/>
      </Box>
    </>
  ) : null ;

  const actionBar = (
    <ActionBar mt={ -6 } justifyContent="left">
      <AddressTxsFilter
        initialValue={ filterValue }
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
      itemsNum={ data?.items.length }
      filterProps={{ emptyFilteredText: `Couldn${ apos }t find any transaction that matches your query.`, hasActiveFilters: Boolean(filterValue) }}
      emptyText="There are no internal transactions for this address."
      actionBar={ actionBar }
    >
      { content }
    </DataListDisplay>
  );
};

export default AddressInternalTxs;
