// SPDX-License-Identifier: LicenseRef-Blockscout

import {
  Text,
  Flex,
  HStack,
} from '@chakra-ui/react';
import { omit } from 'es-toolkit';
import React from 'react';

import type { AdvancedFilterParams } from '../../types/api';
import { ADVANCED_FILTER_AGES, ADVANCED_FILTER_ADDRESS_RELATION } from '../../types/api';
import type { ColumnsIds } from '../../types/client';
import type { ClusterChainConfig } from 'src/features/multichain/types/client';

import useApiQuery from 'src/api/hooks/useApiQuery';
import type { PaginationFilters } from 'src/api/resources';

import ActionBar from 'src/shell/page/action-bar/ActionBar';
import PageTitle from 'src/shell/page/title/PageTitle';

import CsvExport from 'src/features/csv-export/components/CsvExport';
import { useMultichainContext } from 'src/features/multichain/context';

import dayjs from 'src/shared/date-and-time/dayjs';
import DataList from 'src/shared/lists/DataList';
import Pagination from 'src/shared/pagination/Pagination';
import useApiPaginatedQuery from 'src/shared/pagination/useApiPaginatedQuery';
import { usePaginationParams } from 'src/shared/pagination/usePaginationParams';
import { generateListStub } from 'src/shared/pagination/utils';
import getFilterValueFromQuery from 'src/shared/router/get-filter-value-from-query';
import getFilterValuesFromQuery from 'src/shared/router/get-filter-values-from-query';
import getQueryParamString from 'src/shared/router/get-query-param-string';
import getValuesArrayFromQuery from 'src/shared/router/get-values-array-from-query';
import SpriteIcon from 'src/sprite/SpriteIcon';

import { Link } from 'src/toolkit/chakra/link';
import { Tag } from 'src/toolkit/chakra/tag';

import ColumnsButton from '../../components/ColumnsButton';
import { ADVANCED_FILTER_ITEM } from '../../stubs';
import { TABLE_COLUMNS } from '../../utils/consts';
import { getAdvancedFilterTypes, getDurationFromAge, getFilterTags } from '../../utils/lib';
import AdvancedFilterTable from './AdvancedFilterTable';

const COLUMNS_CHECKED = {} as Record<ColumnsIds, boolean>;
TABLE_COLUMNS.forEach(c => COLUMNS_CHECKED[c.id] = true);

const AGE_RANGE_FIELDS = [ 'age_from', 'age_to' ] as const;

type UrlFilters = PaginationFilters<'core:advanced_filter'>;

function getFiltersFromQuery(query: UrlFilters, chainConfig: ClusterChainConfig['app_config'] | undefined): AdvancedFilterParams {
  const age = getFilterValueFromQuery(ADVANCED_FILTER_AGES, query.age);
  const addressRelation = getFilterValueFromQuery(ADVANCED_FILTER_ADDRESS_RELATION, query.address_relation);
  return {
    transaction_types: getFilterValuesFromQuery(getAdvancedFilterTypes(chainConfig).map(t => t.id), query.transaction_types),
    methods: getValuesArrayFromQuery(query.methods),
    methods_names: getValuesArrayFromQuery(query.methods_names),
    amount_from: getQueryParamString(query.amount_from),
    amount_to: getQueryParamString(query.amount_to),
    age,
    age_to: age ? dayjs().toISOString() : getQueryParamString(query.age_to),
    age_from: age ? dayjs((dayjs().valueOf() - getDurationFromAge(age))).toISOString() : getQueryParamString(query.age_from),
    address_relation: addressRelation,
    token_contract_address_hashes_to_exclude: getValuesArrayFromQuery(query.token_contract_address_hashes_to_exclude),
    token_contract_symbols_to_exclude: getValuesArrayFromQuery(query.token_contract_symbols_to_exclude),
    token_contract_address_hashes_to_include: getValuesArrayFromQuery(query.token_contract_address_hashes_to_include),
    token_contract_symbols_to_include: getValuesArrayFromQuery(query.token_contract_symbols_to_include),
    to_address_hashes_to_include: getValuesArrayFromQuery(query.to_address_hashes_to_include),
    from_address_hashes_to_include: getValuesArrayFromQuery(query.from_address_hashes_to_include),
    to_address_hashes_to_exclude: getValuesArrayFromQuery(query.to_address_hashes_to_exclude),
    from_address_hashes_to_exclude: getValuesArrayFromQuery(query.from_address_hashes_to_exclude),
  };
}

const AdvancedFilter = () => {
  const multichainContext = useMultichainContext();
  const chainConfig = multichainContext?.chain?.app_config;

  // Keyed by the filter values rather than the object: the URL object changes on every page change, and an age
  // preset's computed range must stay the same across pages so cached pages are found again.
  const urlFiltersKey = JSON.stringify(usePaginationParams('core:advanced_filter').filters);
  const filters = React.useMemo(
    () => getFiltersFromQuery(JSON.parse(urlFiltersKey) as UrlFilters, chainConfig),
    [ urlFiltersKey, chainConfig ],
  );

  const [ columns, setColumns ] = React.useState<Record<ColumnsIds, boolean>>(COLUMNS_CHECKED);
  const { data, isError, isLoading, pagination, onFilterChange, isInitialLoading, isTransitioning, queryHash } = useApiPaginatedQuery({
    resourceName: 'core:advanced_filter',
    queryParams: filters,
    options: {
      placeholderData: generateListStub<'core:advanced_filter'>(
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

  // maybe don't need to prefetch, but on dev sepolia those requests take several seconds.
  useApiQuery('core:tokens', { queryParams: { limit: '7', q: '' }, queryOptions: { refetchOnMount: false } });
  useApiQuery('core:advanced_filter_methods', { queryParams: { q: '' }, queryOptions: { refetchOnMount: false } });

  const latestFilters = React.useRef(filters);
  latestFilters.current = filters;
  const pendingFilters = React.useRef<AdvancedFilterParams | null>(null);

  // The filter components report one field per call and several per user action (an age preset sets its range
  // and the preset, the asset filter sets addresses and symbols). The calls of one tick are collected and
  // pushed to the URL together, so one action is one navigation and one request.
  const handleFilterChange = React.useCallback(<T extends keyof AdvancedFilterParams>(field: T, val: AdvancedFilterParams[T]) => {
    if (pendingFilters.current === null) {
      pendingFilters.current = { ...latestFilters.current };
      queueMicrotask(() => {
        const nextFilters = pendingFilters.current ?? {};
        pendingFilters.current = null;
        onFilterChange(nextFilters.age ? omit(nextFilters, AGE_RANGE_FIELDS) : nextFilters);
      });
    }
    pendingFilters.current[field] = val;
  }, [ onFilterChange ]);

  const onClearFilter = React.useCallback((key: keyof AdvancedFilterParams) => () => {
    if (key === 'methods') {
      handleFilterChange('methods_names', undefined);
    }
    if (key === 'token_contract_address_hashes_to_exclude') {
      handleFilterChange('token_contract_symbols_to_exclude', undefined);
    }
    if (key === 'token_contract_address_hashes_to_include') {
      handleFilterChange('token_contract_symbols_to_include', undefined);
    }
    if (key === 'age') {
      handleFilterChange('age_from', undefined);
      handleFilterChange('age_to', undefined);
    }
    handleFilterChange(key, undefined);
  }, [ handleFilterChange ]);

  const clearAllFilters = React.useCallback(() => {
    onFilterChange({});
  }, [ onFilterChange ]);

  const columnsToShow = TABLE_COLUMNS.filter(c => columns[c.id]);

  if (isLoading) {
    return null;
  }

  const filterTags = getFilterTags(filters, chainConfig);

  const content = data?.items ? (
    <AdvancedFilterTable
      items={ data.items }
      columns={ columnsToShow }
      filters={ filters }
      searchParams={ data.search_params }
      handleFilterChange={ handleFilterChange }
      isLoading={ isInitialLoading }
      resetKey={ queryHash }
    />
  ) : null;

  const actionBar = (
    <ActionBar mt={ -6 }>
      <ColumnsButton columns={ columns } onChange={ setColumns }/>
      <CsvExport
        type="advanced_filters"
        resourceName="core:advanced_filter_csv"
        queryParams={ filters }
        extraParams={{
          created_at: dayjs().toISOString(),
        }}
        periodFilter={ false }
        ml={ 3 }
      />
      <Pagination ml="auto" { ...pagination }/>
    </ActionBar>
  );

  return (
    <>
      <PageTitle
        title="Advanced filter"
        withTextAd
      />
      <Flex mb={ 4 } justifyContent="space-between" alignItems="start">
        <Text fontSize="lg" mr={ 3 } lineHeight="24px" w="100px">Filtered by:</Text>
        { filterTags.length !== 0 && (
          <Link onClick={ clearAllFilters } display="flex" alignItems="center" justifyContent="end" gap={ 2 } fontSize="sm" w="150px">
            <SpriteIcon name="repeat" boxSize={ 5 }/>
            Reset filters
          </Link>
        ) }
      </Flex>
      <HStack gap={ 2 } flexWrap="wrap" mb={ 6 }>
        { multichainContext?.chain && (
          <Tag variant="filter" label="Chain">
            { multichainContext.chain.app_config.chain.name }
          </Tag>
        ) }
        { filterTags.map(t => (
          <Tag key={ t.name } variant="filter" onClose={ onClearFilter(t.key) } closable label={ t.name }>
            { t.value }
          </Tag>
        )) }
        { filterTags.length === 0 && (
          <>
            <Tag variant="filter" label="Type">
              All
            </Tag>
            <Tag variant="filter" label="Age">
              7d
            </Tag>
          </>
        ) }
      </HStack>
      <DataList
        isError={ isError }
        itemsNum={ data?.items.length }
        emptyText="There are no transactions."
        actionBar={ actionBar }
        hasActiveFilters={ Object.values(filters).some(Boolean) }
        emptyStateProps={{
          term: 'transaction',
        }}
        isTransitioning={ isTransitioning }
      >
        { content }
      </DataList>
    </>
  );
};

export default AdvancedFilter;
