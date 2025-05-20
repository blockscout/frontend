import { Box } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import type { EnsDomainLookupFiltersOptions, EnsLookupSorting } from 'types/api/ens';

import config from 'configs/app';
import useApiQuery from 'lib/api/useApiQuery';
import useDebounce from 'lib/hooks/useDebounce';
import getQueryParamString from 'lib/router/getQueryParamString';
import { ENS_DOMAIN } from 'stubs/ENS';
import { generateListStub } from 'stubs/utils';
import { ADDRESS_REGEXP } from 'toolkit/components/forms/validators/address';
import { apos } from 'toolkit/utils/htmlEntities';
import NameDomainsActionBar from 'ui/nameDomains/NameDomainsActionBar';
import NameDomainsListItem from 'ui/nameDomains/NameDomainsListItem';
import NameDomainsTable from 'ui/nameDomains/NameDomainsTable';
import type { Sort, SortField } from 'ui/nameDomains/utils';
import { SORT_OPTIONS, getNextSortValue } from 'ui/nameDomains/utils';
import DataListDisplay from 'ui/shared/DataListDisplay';
import PageTitle from 'ui/shared/Page/PageTitle';
import useQueryWithPages from 'ui/shared/pagination/useQueryWithPages';
import getSortParamsFromValue from 'ui/shared/sort/getSortParamsFromValue';
import getSortValueFromQuery from 'ui/shared/sort/getSortValueFromQuery';

const NameDomains = () => {
  const router = useRouter();

  const q = getQueryParamString(router.query.name) || getQueryParamString(router.query.address);
  const ownedBy = getQueryParamString(router.query.owned_by);
  const resolvedTo = getQueryParamString(router.query.resolved_to);
  const onlyActive = getQueryParamString(router.query.only_active);
  const protocols = Array.isArray(router.query.protocols) ? router.query.protocols : (router.query.protocols ?? '').split(',').filter(Boolean);

  const initialFilters: EnsDomainLookupFiltersOptions = [
    ownedBy === 'true' ? 'owned_by' as const : undefined,
    resolvedTo === 'true' ? 'resolved_to' as const : undefined,
    onlyActive === 'false' ? 'with_inactive' as const : undefined,
  ].filter(Boolean);
  const initialSort = getSortValueFromQuery<Sort>(router.query, SORT_OPTIONS);

  const [ searchTerm, setSearchTerm ] = React.useState<string>(q || '');
  const [ filterValue, setFilterValue ] = React.useState<EnsDomainLookupFiltersOptions>(initialFilters);
  const [ sort, setSort ] = React.useState<Sort>(initialSort ?? 'default');
  const [ protocolsFilter, setProtocolsFilter ] = React.useState<Array<string>>(protocols);

  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const isAddressSearch = React.useMemo(() => ADDRESS_REGEXP.test(debouncedSearchTerm), [ debouncedSearchTerm ]);
  const sortParams = getSortParamsFromValue<Sort, EnsLookupSorting['sort'], EnsLookupSorting['order']>(sort);

  const addressesLookupQuery = useQueryWithPages({
    resourceName: 'bens:addresses_lookup',
    pathParams: { chainId: config.chain.id },
    filters: {
      address: debouncedSearchTerm,
      resolved_to: filterValue.includes('resolved_to'),
      owned_by: filterValue.includes('owned_by'),
      only_active: !filterValue.includes('with_inactive'),
      protocols: protocolsFilter.length > 0 ? protocolsFilter : undefined,
    },
    sorting: sortParams,
    options: {
      enabled: isAddressSearch,
      placeholderData: generateListStub<'bens:addresses_lookup'>(ENS_DOMAIN, 50, { next_page_params: undefined }),
    },
  });

  const domainsLookupQuery = useQueryWithPages({
    resourceName: 'bens:domains_lookup',
    pathParams: { chainId: config.chain.id },
    filters: {
      name: debouncedSearchTerm,
      only_active: !filterValue.includes('with_inactive'),
      protocols: protocolsFilter.length > 0 ? protocolsFilter : undefined,
    },
    sorting: sortParams,
    options: {
      enabled: !isAddressSearch,
      placeholderData: generateListStub<'bens:domains_lookup'>(ENS_DOMAIN, 50, { next_page_params: undefined }),
    },
  });

  const protocolsQuery = useApiQuery('bens:domain_protocols', {
    pathParams: { chainId: config.chain.id },
  });

  const query = isAddressSearch ? addressesLookupQuery : domainsLookupQuery;
  const { data, isError, isPlaceholderData: isLoading, onFilterChange, onSortingChange } = query;

  React.useEffect(() => {
    const hasInactiveFilter = filterValue.some((value) => value === 'with_inactive');
    if (isAddressSearch) {
      setFilterValue([ 'owned_by' as const, 'resolved_to' as const, hasInactiveFilter ? 'with_inactive' as const : undefined ].filter(Boolean));
      onFilterChange<'bens:addresses_lookup'>({
        address: debouncedSearchTerm,
        resolved_to: true,
        owned_by: true,
        only_active: !hasInactiveFilter,
        protocols: protocolsFilter,
      });
    } else {
      setFilterValue([ hasInactiveFilter ? 'with_inactive' as const : undefined ].filter(Boolean));
      onFilterChange<'bens:domains_lookup'>({
        name: debouncedSearchTerm,
        only_active: !hasInactiveFilter,
        protocols: protocolsFilter,
      });
    }
  // should run only the type of search changes
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ isAddressSearch ]);

  const handleSortToggle = React.useCallback((field: SortField) => {
    if (isLoading) {
      return;
    }

    if (field) {
      setSort((prevValue) => {
        const nextSortValue = getNextSortValue(field)(prevValue);
        onSortingChange(getSortParamsFromValue(nextSortValue));
        return nextSortValue;
      });
    }
  }, [ isLoading, onSortingChange ]);

  const handleSearchTermChange = React.useCallback((value: string) => {
    setSearchTerm(value);
    const isAddressSearch = ADDRESS_REGEXP.test(value);
    if (isAddressSearch) {
      onFilterChange<'bens:addresses_lookup'>({
        address: value,
        resolved_to: filterValue.includes('resolved_to'),
        owned_by: filterValue.includes('owned_by'),
        only_active: !filterValue.includes('with_inactive'),
        protocols: protocolsFilter,
      });
    } else {
      onFilterChange<'bens:domains_lookup'>({
        name: value,
        only_active: !filterValue.includes('with_inactive'),
        protocols: protocolsFilter,
      });
    }
  }, [ onFilterChange, filterValue, protocolsFilter ]);

  const handleFilterValueChange = React.useCallback((value: EnsDomainLookupFiltersOptions) => {
    setFilterValue(value);

    const isAddressSearch = ADDRESS_REGEXP.test(debouncedSearchTerm);
    if (isAddressSearch) {
      onFilterChange<'bens:addresses_lookup'>({
        address: debouncedSearchTerm,
        resolved_to: value.includes('resolved_to'),
        owned_by: value.includes('owned_by'),
        only_active: !value.includes('with_inactive'),
        protocols: protocolsFilter,
      });
    } else {
      onFilterChange<'bens:domains_lookup'>({
        name: debouncedSearchTerm,
        only_active: !value.includes('with_inactive'),
        protocols: protocolsFilter,
      });
    }
  }, [ debouncedSearchTerm, onFilterChange, protocolsFilter ]);

  const handleProtocolsFilterChange = React.useCallback((nextValue: Array<string>) => {
    setProtocolsFilter(nextValue);

    const isAddressSearch = ADDRESS_REGEXP.test(debouncedSearchTerm);
    if (isAddressSearch) {
      onFilterChange<'bens:addresses_lookup'>({
        address: debouncedSearchTerm,
        resolved_to: filterValue.includes('resolved_to'),
        owned_by: filterValue.includes('owned_by'),
        only_active: !filterValue.includes('with_inactive'),
        protocols: nextValue,
      });
    } else {
      onFilterChange<'bens:domains_lookup'>({
        name: debouncedSearchTerm,
        only_active: !filterValue.includes('with_inactive'),
        protocols: nextValue,
      });
    }
  }, [ debouncedSearchTerm, filterValue, onFilterChange ]);

  const hasActiveFilters = Boolean(debouncedSearchTerm) || filterValue.length > 0 ||
    (protocolsQuery.data && protocolsQuery.data.items.length > 1 ? protocolsFilter.length > 0 : false);

  const content = (
    <>
      <Box hideFrom="lg">
        { data?.items.map((item, index) => (
          <NameDomainsListItem
            key={ item.id + (isLoading ? index : '') }
            { ...item }
            isLoading={ isLoading }
          />
        )) }
      </Box>
      <Box hideBelow="lg">
        <NameDomainsTable
          data={ data }
          isLoading={ isLoading }
          sort={ sort }
          onSortToggle={ handleSortToggle }
        />
      </Box>
    </>
  );

  const actionBar = (
    <NameDomainsActionBar
      isLoading={ isLoading }
      searchTerm={ searchTerm }
      onSearchChange={ handleSearchTermChange }
      filterValue={ filterValue }
      onFilterValueChange={ handleFilterValueChange }
      protocolsData={ protocolsQuery.data?.items }
      protocolsFilterValue={ protocolsFilter }
      onProtocolsFilterChange={ handleProtocolsFilterChange }
      sort={ sort }
      onSortChange={ setSort }
      isAddressSearch={ isAddressSearch }
      pagination={ query.pagination }
    />
  );

  return (
    <>
      <PageTitle
        title={ config.meta.seo.enhancedDataEnabled ? `${ config.chain.name } name domains` : 'Name services lookup' }
        withTextAd
      />
      <DataListDisplay
        isError={ isError }
        itemsNum={ data?.items.length }
        emptyText="There are no name domains."
        filterProps={{
          emptyFilteredText: `Couldn${ apos }t find name domains that match your filter query.`,
          hasActiveFilters,
        }}
        actionBar={ actionBar }
      >
        { content }
      </DataListDisplay>
    </>
  );
};

export default NameDomains;
