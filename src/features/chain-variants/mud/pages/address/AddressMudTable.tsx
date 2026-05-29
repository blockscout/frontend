// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box, HStack, chakra } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import type { AddressMudRecordsFilter, AddressMudRecordsSorting } from 'src/features/chain-variants/mud/types/api';

import ActionBar, { ACTION_BAR_HEIGHT_DESKTOP } from 'src/shell/page/action-bar/ActionBar';

import useIsMobile from 'src/shared/hooks/useIsMobile';
import DataList from 'src/shared/lists/DataList';
import Pagination from 'src/shared/pagination/Pagination';
import useQueryWithPages from 'src/shared/pagination/useQueryWithPages';
import getQueryParamString from 'src/shared/router/get-query-param-string';
import { getNextOrderValue } from 'src/shared/sort/get-next-sort-value';
import getSortParamsFromQuery from 'src/shared/sort/get-sort-params-from-query';

import { Tag } from 'src/toolkit/chakra/tag';
import { ContentLoader } from 'src/toolkit/components/loaders/ContentLoader';

import AddressMudBreadcrumbs from './AddressMudBreadcrumbs';
import AddressMudRecordsTable from './AddressMudRecordsTable';
import { getNameTypeText, SORT_SEQUENCE } from './utils';

const BREADCRUMBS_HEIGHT = 60;
const FILTERS_HEIGHT = 44;

type Props = {
  isQueryEnabled?: boolean;
  tableId: string;
};

type FilterKeys = keyof AddressMudRecordsFilter;

const AddressMudTable = ({ tableId, isQueryEnabled = true }: Props) => {
  const router = useRouter();
  const [ sorting, setSorting ] =
    React.useState<AddressMudRecordsSorting | undefined>(getSortParamsFromQuery<AddressMudRecordsSorting>(router.query, SORT_SEQUENCE));
  const [ filters, setFilters ] = React.useState<AddressMudRecordsFilter>({});
  const isMobile = useIsMobile();
  const [ tableHasHorizontalScroll, setTableHasHorizontalScroll ] = React.useState(isMobile);

  const hash = getQueryParamString(router.query.hash);

  const { data, isLoading, isError, pagination, onSortingChange } = useQueryWithPages({
    resourceName: 'core:mud_records',
    pathParams: { hash, table_id: tableId },
    filters,
    sorting,
    options: {
      // no placeholder data because the structure of a table is unpredictable
      enabled: isQueryEnabled,
    },
  });

  const handleTableHasHorizontalScroll = React.useCallback(() => {
    setTableHasHorizontalScroll((prev) => !prev);
  }, []);

  const toggleSorting = React.useCallback((val: AddressMudRecordsSorting['sort']) => {
    const newSorting = { sort: val, order: getNextOrderValue(sorting?.sort === val ? sorting.order : undefined) };
    setSorting(newSorting);
    onSortingChange(newSorting);
  }, [ onSortingChange, sorting ]);

  const onRemoveFilterClick = React.useCallback((key: FilterKeys) => () => {
    setFilters(prev => {
      const newFilters = { ...prev };
      delete newFilters[key];
      return newFilters;
    });
  }, []);

  const hasActiveFilters = Object.values(filters).some(Boolean);

  const actionBarHeight = React.useMemo(() => {
    const heightWithoutFilters = pagination.isVisible ? ACTION_BAR_HEIGHT_DESKTOP : BREADCRUMBS_HEIGHT;

    return hasActiveFilters ? heightWithoutFilters + FILTERS_HEIGHT : heightWithoutFilters;
  }, [ pagination.isVisible, hasActiveFilters ]);

  if (isLoading) {
    return <ContentLoader/>;
  }

  const filtersTags = hasActiveFilters ? (
    <HStack gap={ 3 } mb={ 1 } flexWrap="wrap">
      { Object.entries(filters).map(([ key, value ]) => {
        const index = key as FilterKeys === 'filter_key0' ? 0 : 1;
        return (
          <Tag
            key={ key }
            variant="filter"
            label={ getNameTypeText(data?.schema.key_names[index] || '', data?.schema.key_types[index] || '') }
            closable
            onClose={ onRemoveFilterClick(key as FilterKeys) }
            maxW="360px"
          >
            { value }
          </Tag>
        );
      }) }
    </HStack>
  ) : null;

  const breadcrumbs = data ? (
    <AddressMudBreadcrumbs
      hash={ hash }
      tableId={ tableId }
      tableName={ data?.table.table_full_name }
      mb={ hasActiveFilters ? 4 : 0 }
    />
  ) : null;

  const actionBar = (!isMobile || hasActiveFilters || pagination.isVisible) && (
    <ActionBar mt={ -6 } showShadow={ tableHasHorizontalScroll } justifyContent="space-between" alignItems={ hasActiveFilters ? 'start' : 'center' }>
      <Box>
        { !isMobile && breadcrumbs }
        { filtersTags }
      </Box>
      <Pagination ml={{ base: 0, lg: 8 }} { ...pagination }/>
    </ActionBar>
  );

  const content = data?.items ? (
    <AddressMudRecordsTable
      data={ data }
      top={ actionBarHeight }
      sorting={ sorting }
      toggleSorting={ toggleSorting }
      setFilters={ setFilters }
      filters={ filters }
      toggleTableHasHorizontalScroll={ handleTableHasHorizontalScroll }
      hash={ hash }
    />
  ) : null;

  const emptyText = (
    <>
      <chakra.span>There are no records for </chakra.span>
      { data?.table.table_full_name ? <chakra.span fontWeight={ 600 }>{ data?.table.table_full_name }</chakra.span> : 'this table' }
    </>
  );

  return (
    <>
      { isMobile && (
        <Box mb={ 6 }>{ breadcrumbs }</Box>
      ) }
      <DataList
        isError={ isError }
        itemsNum={ data?.items.length }
        emptyText={ emptyText }
        hasActiveFilters={ hasActiveFilters }
        emptyStateProps={{
          term: 'record',
        }}
        actionBar={ actionBar }
        showActionBarIfEmpty={ !isMobile }
        mt={ data?.items.length ? 0 : 2 }
      >
        { content }
      </DataList>
    </>
  );
};

export default AddressMudTable;
