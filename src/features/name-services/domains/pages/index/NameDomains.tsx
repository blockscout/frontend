// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box } from '@chakra-ui/react';
import React from 'react';

import type { EnsDomainLookupFiltersOptions, EnsLookupSorting } from 'src/features/name-services/domains/types/api';

import useApiQuery from 'src/api/hooks/useApiQuery';
import type { PaginationFilters } from 'src/api/resources';

import { ENS_DOMAIN } from 'src/features/name-services/domains/stubs';

import config from 'src/config';
import DataList from 'src/shared/lists/DataList';
import { useDebouncedFilterChange } from 'src/shared/pagination/useDebouncedFilterChange';
import { usePaginationParams } from 'src/shared/pagination/usePaginationParams';
import useQueryWithPages from 'src/shared/pagination/useQueryWithPages';
import { generateListStub } from 'src/shared/pagination/utils';
import getQueryParamString from 'src/shared/router/get-query-param-string';
import getSortParamsFromValue from 'src/shared/sort/get-sort-params-from-value';
import getSortValueFromQuery from 'src/shared/sort/get-sort-value-from-query';

import { ADDRESS_REGEXP } from 'src/toolkit/utils/regexp';

import NameDomainsActionBar from './NameDomainsActionBar';
import NameDomainsList from './NameDomainsList';
import NameDomainsTable from './NameDomainsTable';
import type { Sort, SortField } from './utils';
import { SORT_OPTIONS, getNextSortValue } from './utils';

const feature = config.features.nameServices;
const availableProtocols = feature.isEnabled && feature.ens.isEnabled ? feature.ens.protocols : [];

const NO_PROTOCOLS: Array<string> = [];
const ADDRESS_SEARCH_DEFAULT_FILTERS: EnsDomainLookupFiltersOptions = [ 'owned_by', 'resolved_to' ];

type AddressesLookupFilters = PaginationFilters<'bens:addresses_lookup'>;

interface LookupState {
  readonly searchTerm: string;
  readonly filterValue: EnsDomainLookupFiltersOptions;
  readonly protocols: Array<string>;
}

// The resource types these as booleans; read from the URL they are the strings 'true' / 'false'.
function isFalseParam(value: boolean | string | Array<string> | undefined): boolean {
  return String(value) === 'false';
}

function getFilterValueFromQuery(filters: AddressesLookupFilters, isAddressSearch: boolean): EnsDomainLookupFiltersOptions {
  return [
    isAddressSearch && !isFalseParam(filters.owned_by) ? 'owned_by' as const : undefined,
    isAddressSearch && !isFalseParam(filters.resolved_to) ? 'resolved_to' as const : undefined,
    isFalseParam(filters.only_active) ? 'with_inactive' as const : undefined,
  ].filter(Boolean);
}

function getProtocolsFromQuery(value: string | Array<string> | undefined): Array<string> {
  const protocols = getQueryParamString(value)
    .split(',')
    .filter(Boolean)
    .filter((protocol) => availableProtocols.includes(protocol));

  return protocols.length > 0 ? protocols : NO_PROTOCOLS;
}

const NameDomains = () => {
  const { filters: addressesFilters, sorting } = usePaginationParams('bens:addresses_lookup');
  const { filters: domainsFilters } = usePaginationParams('bens:domains_lookup');

  const searchTerm = getQueryParamString(domainsFilters.name) || getQueryParamString(addressesFilters.address);
  const isAddressSearch = ADDRESS_REGEXP.test(searchTerm);
  const filterValue = React.useMemo(() => getFilterValueFromQuery(addressesFilters, isAddressSearch), [ addressesFilters, isAddressSearch ]);
  const protocolsParam = addressesFilters.protocols;
  const protocolsFilter = React.useMemo(() => getProtocolsFromQuery(protocolsParam), [ protocolsParam ]);
  const sort = getSortValueFromQuery<Sort>({ ...sorting }, SORT_OPTIONS) ?? 'default';

  const onlyActive = !filterValue.includes('with_inactive');
  const requestedProtocols = protocolsFilter.length > 0 ? protocolsFilter : availableProtocols;

  const addressesLookupQuery = useQueryWithPages({
    resourceName: 'bens:addresses_lookup',
    queryParams: {
      address: searchTerm,
      resolved_to: filterValue.includes('resolved_to'),
      owned_by: filterValue.includes('owned_by'),
      only_active: onlyActive,
      protocols: requestedProtocols,
    },
    options: {
      enabled: isAddressSearch,
      placeholderData: generateListStub<'bens:addresses_lookup'>(ENS_DOMAIN, 50, { next_page_params: undefined }),
    },
  });

  const domainsLookupQuery = useQueryWithPages({
    resourceName: 'bens:domains_lookup',
    queryParams: {
      name: searchTerm,
      only_active: onlyActive,
      protocols: requestedProtocols,
    },
    options: {
      enabled: !isAddressSearch,
      placeholderData: generateListStub<'bens:domains_lookup'>(ENS_DOMAIN, 50, { next_page_params: undefined }),
    },
  });

  const protocolsQuery = useApiQuery('bens:protocols');

  const query = isAddressSearch ? addressesLookupQuery : domainsLookupQuery;
  const { data, isError, isInitialLoading, isTransitioning, onFilterChange, onSortingChange, queryHash } = query;

  const pushLookupState = React.useCallback((next: LookupState) => {
    if (ADDRESS_REGEXP.test(next.searchTerm)) {
      onFilterChange<'bens:addresses_lookup'>({
        address: next.searchTerm,
        resolved_to: next.filterValue.includes('resolved_to'),
        owned_by: next.filterValue.includes('owned_by'),
        only_active: !next.filterValue.includes('with_inactive'),
        protocols: next.protocols,
      });
      return;
    }

    onFilterChange<'bens:domains_lookup'>({
      name: next.searchTerm,
      only_active: !next.filterValue.includes('with_inactive'),
      protocols: next.protocols,
    });
  }, [ onFilterChange ]);

  const handleSearchTermChange = useDebouncedFilterChange((value) => {
    const switchesToAddressSearch = !isAddressSearch && ADDRESS_REGEXP.test(value);
    const nextFilterValue = switchesToAddressSearch ?
      [ ...ADDRESS_SEARCH_DEFAULT_FILTERS, ...filterValue.filter((item) => item === 'with_inactive') ] :
      filterValue;
    pushLookupState({ searchTerm: value, filterValue: nextFilterValue, protocols: protocolsFilter });
  });

  const handleFilterValueChange = React.useCallback((value: EnsDomainLookupFiltersOptions) => {
    pushLookupState({ searchTerm, filterValue: value, protocols: protocolsFilter });
  }, [ pushLookupState, searchTerm, protocolsFilter ]);

  const handleProtocolsFilterChange = React.useCallback((nextValue: Array<string>) => {
    pushLookupState({ searchTerm, filterValue, protocols: nextValue });
  }, [ pushLookupState, searchTerm, filterValue ]);

  const handleSortChange = React.useCallback((nextValue: Sort) => {
    onSortingChange(getSortParamsFromValue<Sort, EnsLookupSorting['sort'], EnsLookupSorting['order']>(nextValue));
  }, [ onSortingChange ]);

  const handleSortToggle = React.useCallback((field: SortField) => {
    if (isInitialLoading || !field) {
      return;
    }

    handleSortChange(getNextSortValue(field)(sort));
  }, [ isInitialLoading, handleSortChange, sort ]);

  const hasActiveFilters = Boolean(searchTerm) || filterValue.length > 0 ||
    (protocolsQuery.data && availableProtocols.length > 1 ? protocolsFilter.length > 0 : false);

  const content = data?.items ? (
    <>
      <Box hideFrom="lg">
        <NameDomainsList
          items={ data.items }
          isLoading={ isInitialLoading }
          resetKey={ queryHash }
        />
      </Box>
      <Box hideBelow="lg">
        <NameDomainsTable
          items={ data.items }
          isLoading={ isInitialLoading }
          sort={ sort }
          onSortToggle={ handleSortToggle }
          resetKey={ queryHash }
        />
      </Box>
    </>
  ) : null;

  const protocolsData = React.useMemo(() => {
    return protocolsQuery.data?.items?.filter((item) => availableProtocols.includes(item.id));
  }, [ protocolsQuery.data?.items ]);

  const actionBar = (
    <NameDomainsActionBar
      isLoading={ isInitialLoading }
      searchTerm={ searchTerm }
      onSearchChange={ handleSearchTermChange }
      filterValue={ filterValue }
      onFilterValueChange={ handleFilterValueChange }
      protocolsData={ protocolsData }
      protocolsFilterValue={ protocolsFilter }
      onProtocolsFilterChange={ handleProtocolsFilterChange }
      sort={ sort }
      onSortChange={ handleSortChange }
      isAddressSearch={ isAddressSearch }
      pagination={ query.pagination }
    />
  );

  return (
    <DataList
      isError={ isError }
      itemsNum={ data?.items.length }
      emptyText="There are no name domains."
      hasActiveFilters={ hasActiveFilters }
      emptyStateProps={{
        term: 'name domain',
      }}
      actionBar={ actionBar }
      isTransitioning={ isTransitioning }
    >
      { content }
    </DataList>
  );
};

export default NameDomains;
