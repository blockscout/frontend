// SPDX-License-Identifier: LicenseRef-Blockscout

import { useRouter } from 'next/router';
import React from 'react';

import type { NovesHistoryFilterValue } from 'src/features/tx-interpretation/noves/types/api';
import { NovesHistoryFilterValues } from 'src/features/tx-interpretation/noves/types/api';

import ActionBar from 'src/shell/page/action-bar/ActionBar';

import { NOVES_TRANSLATE } from 'src/features/tx-interpretation/noves/stubs';
import { getFromToValue } from 'src/features/tx-interpretation/noves/utils/from-to';

import useIsMounted from 'src/shared/hooks/useIsMounted';
import DataList from 'src/shared/lists/DataList';
import Pagination from 'src/shared/pagination/Pagination';
import useQueryWithPages from 'src/shared/pagination/useQueryWithPages';
import { generateListStub } from 'src/shared/pagination/utils';
import getFilterValueFromQuery from 'src/shared/router/get-filter-value-from-query';
import getQueryParamString from 'src/shared/router/get-query-param-string';

import { TableBody, TableColumnHeader, TableContainerScrollable, TableHeaderSticky, TableRoot, TableRow } from 'src/toolkit/chakra/table';

import AccountHistoryFilter from './AddressAccountHistoryFilter';
import AddressAccountHistoryTableItem from './AddressAccountHistoryTableItem';

const getFilterValue = (getFilterValueFromQuery<NovesHistoryFilterValue>).bind(null, NovesHistoryFilterValues);

type Props = {
  shouldRender?: boolean;
  isQueryEnabled?: boolean;
};

const AddressAccountHistory = ({ shouldRender = true, isQueryEnabled = true }: Props) => {
  const router = useRouter();
  const isMounted = useIsMounted();

  const currentAddress = getQueryParamString(router.query.hash).toLowerCase();

  const [ filterValue, setFilterValue ] = React.useState<NovesHistoryFilterValue>(getFilterValue(router.query.filter));

  const { data, isError, pagination, isPlaceholderData } = useQueryWithPages({
    resourceName: 'core:noves_address_history',
    pathParams: { address: currentAddress },
    options: {
      enabled: isQueryEnabled,
      placeholderData: generateListStub<'core:noves_address_history'>(NOVES_TRANSLATE, 10, { hasNextPage: false, pageNumber: 1, pageSize: 10 }),
    },
  });

  const handleFilterChange = React.useCallback((val: string | Array<string>) => {

    const newVal = getFilterValue(val);
    setFilterValue(newVal);
  }, [ ]);

  if (!isMounted || !shouldRender) {
    return null;
  }

  const actionBar = (
    <ActionBar mt={ -6 } pb={{ base: 6, md: 5 }}>
      <AccountHistoryFilter
        defaultFilter={ filterValue }
        onFilterChange={ handleFilterChange }
        hasActiveFilter={ Boolean(filterValue) }
        isLoading={ pagination.isLoading }
      />

      <Pagination ml={{ base: 'auto', lg: 8 }} { ...pagination }/>
    </ActionBar>
  );

  const filteredData = isPlaceholderData ? data?.items : data?.items.filter(i => filterValue ? getFromToValue(i, currentAddress) === filterValue : i);

  const content = (
    <TableContainerScrollable>
      <TableRoot minW="900px">
        <TableHeaderSticky top={ 75 }>
          <TableRow>
            <TableColumnHeader width="120px">
              Age
            </TableColumnHeader>
            <TableColumnHeader>
              Action
            </TableColumnHeader>
            <TableColumnHeader width="320px">
              From/To
            </TableColumnHeader>
          </TableRow>
        </TableHeaderSticky>
        <TableBody maxWidth="full">
          { filteredData?.map((item, i) => (
            <AddressAccountHistoryTableItem
              key={ `${ i }-${ item.rawTransactionData.transactionHash }` }
              tx={ item }
              currentAddress={ currentAddress }
              isPlaceholderData={ isPlaceholderData }
            />
          )) }
        </TableBody>
      </TableRoot>
    </TableContainerScrollable>
  );

  return (
    <DataList
      isError={ isError }
      itemsNum={ filteredData?.length }
      emptyText="There are no transactions."
      actionBar={ actionBar }
      hasActiveFilters={ Boolean(filterValue) }
      emptyStateProps={{
        description: 'No match found for current filter',
      }}
    >
      { content }
    </DataList>
  );
};

export default AddressAccountHistory;
