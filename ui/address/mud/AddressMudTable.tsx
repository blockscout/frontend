import { Box, HStack, Hide, Show, Tag, TagCloseButton, chakra, useBoolean } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import type { AddressMudRecordsFilter, AddressMudRecordsSorting } from 'types/api/address';

import { apos, nbsp } from 'lib/html-entities';
import getQueryParamString from 'lib/router/getQueryParamString';
import ActionBar, { ACTION_BAR_HEIGHT_DESKTOP } from 'ui/shared/ActionBar';
import ContentLoader from 'ui/shared/ContentLoader';
import DataListDisplay from 'ui/shared/DataListDisplay';
import Pagination from 'ui/shared/pagination/Pagination';
import useQueryWithPages from 'ui/shared/pagination/useQueryWithPages';
import { getNextOrderValue } from 'ui/shared/sort/getNextSortValue';
import getSortParamsFromQuery from 'ui/shared/sort/getSortParamsFromQuery';

import AddressMudBreadcrumbs from './AddressMudBreadcrumbs';
import AddressMudRecordsTable from './AddressMudRecordsTable';
import { getNameTypeText, SORT_SEQUENCE } from './utils';

type Props ={
  scrollRef?: React.RefObject<HTMLDivElement>;
  isQueryEnabled?: boolean;
  tableId: string;
}

type FilterKeys = keyof AddressMudRecordsFilter;

const AddressMudTable = ({ scrollRef, tableId, isQueryEnabled = true }: Props) => {
  const router = useRouter();
  const [ sorting, setSorting ] =
    React.useState<AddressMudRecordsSorting | undefined>(getSortParamsFromQuery<AddressMudRecordsSorting>(router.query, SORT_SEQUENCE));
  const [ filters, setFilters ] = React.useState<AddressMudRecordsFilter>({});
  const [ tableHasHorisontalScroll, setTableHasHorisontalScroll ] = useBoolean(false);

  const hash = getQueryParamString(router.query.hash);

  const { data, isLoading, isError, pagination, onSortingChange } = useQueryWithPages({
    resourceName: 'address_mud_records',
    pathParams: { hash, table_id: tableId },
    filters,
    sorting,
    scrollRef,
    options: {
      // no placeholder data because the structure of a table is unpredictable
      enabled: isQueryEnabled,
    },
  });

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

  const actionBatHeight = React.useMemo(() => {
    const heightWithoutFilters = pagination.isVisible ? ACTION_BAR_HEIGHT_DESKTOP : 60;

    return hasActiveFilters ? heightWithoutFilters + 44 : heightWithoutFilters;
  }, [ pagination.isVisible, hasActiveFilters ]);

  if (isLoading) {
    return <ContentLoader/>;
  }

  const filtersTags = hasActiveFilters ? (
    <HStack gap={ 3 } mb={ 1 }>
      { Object.entries(filters).map(([ key, value ]) => {
        const index = key as FilterKeys === 'filter_key0' ? 0 : 1;
        return (
          <Tag display="inline-flex" key={ key } maxW="360px" colorScheme="blue">
            <chakra.span color="text_secondary" >{
              getNameTypeText(data?.schema.key_names[index] || '', data?.schema.key_types[index] || '') }
            </chakra.span>
            <chakra.span color="text" overflow="hidden" textOverflow="ellipsis" whiteSpace="nowrap">
              { nbsp }
              { value }
            </chakra.span>
            <TagCloseButton onClick={ onRemoveFilterClick(key as FilterKeys) }/>
          </Tag>
        );
      }) }
    </HStack>
  ) : null;

  const actionBar = (
    <ActionBar mt={ -6 } showShadow={ tableHasHorisontalScroll } justifyContent="space-between" alignItems={ hasActiveFilters ? 'start' : 'center' }>
      <Box>
        { data && (
          <AddressMudBreadcrumbs
            hash={ hash }
            tableId={ tableId }
            tableName={ data?.table.table_full_name }
            scrollRef={ scrollRef }
            mb={ hasActiveFilters ? 4 : 0 }
          />
        ) }
        { filtersTags }
      </Box>
      <Pagination ml={{ base: 0, lg: 8 }} { ...pagination }/>
    </ActionBar>
  );

  const content = data?.items ? (
    <>
      <Hide below="lg" ssr={ false }>
        <AddressMudRecordsTable
          data={ data }
          top={ actionBatHeight }
          sorting={ sorting }
          toggleSorting={ toggleSorting }
          setFilters={ setFilters }
          filters={ filters }
          toggleTableHasHorisontalScroll={ setTableHasHorisontalScroll.toggle }
          scrollRef={ scrollRef }
        />
      </Hide>
      <Show below="lg" ssr={ false }>
          waiting for mobile mockup
        { /* { data.items.map((item, index) => (
            <AddressMudListItem
              key={ item.table.table_id + (isPlaceholderData ? String(index) : '') }
              item={ item }
              isLoading={ isPlaceholderData }
            />
          )) } */ }
      </Show>
    </>
  ) : null;

  return (
    <DataListDisplay
      isError={ isError }
      items={ data?.items }
      emptyText="There are no records for this table."
      filterProps={{
        emptyFilteredText: `Couldn${ apos }t find records that match your filter query.`,
        hasActiveFilters: Object.values(filters).some(Boolean),
      }}
      content={ content }
      actionBar={ actionBar }
      showActionBarIfEmpty
    />
  );
};

export default AddressMudTable;
