import { Table, Tbody, Tr, Th, Td } from '@chakra-ui/react';
import castArray from 'lodash/castArray';
import omit from 'lodash/omit';
import { useRouter } from 'next/router';
import React from 'react';

import type { AdvancedFilterParams } from 'types/api/advancedFilter';
import { ADVANCED_FILTER_TYPES, ADVANCED_FILTER_AGES } from 'types/api/advancedFilter';

import { AddressHighlightProvider } from 'lib/contexts/addressHighlight';
import dayjs from 'lib/date/dayjs';
import getFilterValueFromQuery from 'lib/getFilterValueFromQuery';
import getFilterValuesFromQuery from 'lib/getFilterValuesFromQuery';
import getQueryParamString from 'lib/router/getQueryParamString';
import { ADVANCED_FILTER_ITEM } from 'stubs/advancedFilter';
import { generateListStub } from 'stubs/utils';
import ColumnsButton from 'ui/advancedFilter/ColumnsButton';
import FilterByColumn from 'ui/advancedFilter/FilterByColumn';
import ItemByColumn from 'ui/advancedFilter/ItemByColumn';
import { getDurationFromAge } from 'ui/advancedFilter/lib';
import ActionBar from 'ui/shared/ActionBar';
import DataListDisplay from 'ui/shared/DataListDisplay';
import PageTitle from 'ui/shared/Page/PageTitle';
import Pagination from 'ui/shared/pagination/Pagination';
import useQueryWithPages from 'ui/shared/pagination/useQueryWithPages';
import TheadSticky from 'ui/shared/TheadSticky';

export type ColumnsIds = 'tx_hash' | 'type' | 'method' | 'age' | 'from' | 'or_and' | 'to' | 'amount' | 'asset' | 'fee';

type TxTableColumn = {
  id: ColumnsIds;
  name: string;
  isNumeric?: boolean;
}
export const TABLE_COLUMNS: Array<TxTableColumn> = [
  {
    id: 'tx_hash',
    name: 'Tx hash',
  },
  {
    id: 'type',
    name: 'Type',
  },
  {
    id: 'method',
    name: 'Method',

  },
  {
    id: 'age',
    name: 'Age',
  },
  {
    id: 'from',
    name: 'From',
  },
  {
    id: 'or_and',
    name: 'OR/AND',
  },
  {
    id: 'to',
    name: 'To',
  },
  {
    id: 'amount',
    name: 'Amount',
    isNumeric: true,
  },
  {
    id: 'asset',
    name: 'Asset',
  },
  {
    id: 'fee',
    name: 'Fee',
  },
] as const;

const COLUMNS_CHECKED = {} as Record<ColumnsIds, boolean>;
TABLE_COLUMNS.forEach(c => COLUMNS_CHECKED[c.id] = true);

const AdvancedFilter = () => {
  const router = useRouter();
  const [ filters, setFilters ] = React.useState<AdvancedFilterParams>(() => {
    const age = getFilterValueFromQuery(ADVANCED_FILTER_AGES, router.query.age);
    return {
      tx_types: getFilterValuesFromQuery(ADVANCED_FILTER_TYPES, router.query.tx_types),
      methods: router.query.methods ? castArray(router.query.methods) : undefined,
      amount_from: getQueryParamString(router.query.amount_from),
      amount_to: getQueryParamString(router.query.amount_to),
      age,
      age_to: age ? dayjs().toISOString() : getQueryParamString(router.query.age_to),
      age_from: age ? dayjs((dayjs().valueOf() - getDurationFromAge(age))).toISOString() : getQueryParamString(router.query.age_from),
      token_contract_address_hashes_to_exclude:
        router.query.token_contract_address_hashes_to_exclude ? castArray(router.query.token_contract_address_hashes_to_exclude) : undefined,
      token_contract_address_hashes_to_include:
        router.query.token_contract_address_hashes_to_include ? castArray(router.query.token_contract_address_hashes_to_include) : undefined,
      to_address_hashes_to_include:
        router.query.to_address_hashes_to_include ? castArray(router.query.to_address_hashes_to_include) : undefined,
      from_address_hashes_to_include:
        router.query.from_address_hashes_to_include ? castArray(router.query.from_address_hashes_to_include) : undefined,
      to_address_hashes_to_exclude:
        router.query.to_address_hashes_to_exclude ? castArray(router.query.to_address_hashes_to_exclude) : undefined,
      from_address_hashes_to_exclude:
        router.query.from_address_hashes_to_exclude ? castArray(router.query.from_address_hashes_to_exclude) : undefined,
    };
  });

  const [ columns, setColumns ] = React.useState<Record<ColumnsIds, boolean>>(COLUMNS_CHECKED);
  const { data, isError, isLoading, pagination, onFilterChange, isPlaceholderData } = useQueryWithPages({
    resourceName: 'advanced_filter',
    filters,
    options: {
      placeholderData: generateListStub<'advanced_filter'>(
        ADVANCED_FILTER_ITEM,
        50,
        {
          next_page_params: {
            block_number: 5867485,
            internal_transaction_index: 0,
            items_count: 50,
            token_transfer_index: null,
            transaction_index: 2,
          },
          search_params: {
            tokens: {},
            methods: {},
          },
        },
      ),
    },
  });

  const handleFilterChange = React.useCallback((field: keyof AdvancedFilterParams, val: unknown) => {
    setFilters(prevState => {
      const newState = { ...prevState };
      // fixme
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore:
      newState[field] = val;
      onFilterChange(newState.age ? omit(newState, [ 'age_from', 'age_to' ]) : newState);
      return newState;
    });
  }, [ onFilterChange ]);

  const columnsToShow = React.useMemo(() => {
    return TABLE_COLUMNS.filter(c => columns[c.id]);
  }, [ columns ]);

  if (isLoading) {
    return null;
  }

  const content = (
    <AddressHighlightProvider>
      <Table variant="simple" style={{ tableLayout: 'auto' }} minWidth="950px" size="xs">
        <TheadSticky top={ 80 }>
          <Tr>
            { columnsToShow.map(column => {
              return (
                <Th key={ column.id } isNumeric={ column.isNumeric }>
                  { column.name }
                  <FilterByColumn
                    column={ column.id }
                    columnName={ column.name }
                    handleFilterChange={ handleFilterChange }
                    filters={ filters }
                    searchParams={ data?.search_params }
                    isLoading={ isPlaceholderData }
                  />
                </Th>
              );
            }) }
          </Tr>
        </TheadSticky>
        <Tbody>
          { data?.items.map((item, index) => (
            <Tr key={ item.hash + String(index) }>
              { columnsToShow.map(column => (
                <Td key={ item.hash + column.id } isNumeric={ column.isNumeric }>
                  <ItemByColumn item={ item } column={ column.id } isLoading={ isPlaceholderData }/>
                </Td>
              )) }
            </Tr>
          )) }
        </Tbody>
      </Table>
    </AddressHighlightProvider>
  );

  const actionBar = (
    <ActionBar mt={ -6 }>
      <ColumnsButton columns={ columns } onChange={ setColumns }/>
      <Pagination ml="auto" { ...pagination }/>
    </ActionBar>
  );

  return (
    <>
      <PageTitle
        title="Advanced filter"
        withTextAd
      />
      <DataListDisplay
        isError={ isError }
        items={ data?.items }
        emptyText="There are no transactions."
        content={ content }
        actionBar={ actionBar }
        // filterProps={{
        //   hasActiveFilters: Boolean(filterValue),
        //   emptyFilteredText: 'No match found for current filter',
        // }}
      />
    </>
  );
};

export default AdvancedFilter;
