import { Box, Hide, Show } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import type { EnsDomainLookupFiltersOptions } from 'types/api/ens';

import config from 'configs/app';
import useApiQuery from 'lib/api/useApiQuery';
import useDebounce from 'lib/hooks/useDebounce';
import { apos } from 'lib/html-entities';
import getQueryParamString from 'lib/router/getQueryParamString';
import { ADDRESS_REGEXP } from 'lib/validations/address';
import { ENS_DOMAIN } from 'stubs/ENS';
import { generateListStub } from 'stubs/utils';
import NameDomainsActionBar from 'ui/nameDomains/NameDomainsActionBar';
import NameDomainsListItem from 'ui/nameDomains/NameDomainsListItem';
import NameDomainsTable from 'ui/nameDomains/NameDomainsTable';
import type { Sort, SortField } from 'ui/nameDomains/utils';
import { getNextSortValue } from 'ui/nameDomains/utils';
import DataListDisplay from 'ui/shared/DataListDisplay';
import PageTitle from 'ui/shared/Page/PageTitle';

const NameDomains = () => {
  const router = useRouter();

  const q = getQueryParamString(router.query.q);
  const ownedBy = getQueryParamString(router.query.owned_by);
  const resolvedTo = getQueryParamString(router.query.resolved_to);
  const withInactive = getQueryParamString(router.query.with_inactive);

  const initialFilters: EnsDomainLookupFiltersOptions = [
    ownedBy === 'true' ? 'owned_by' as const : undefined,
    resolvedTo === 'true' ? 'resolved_to' as const : undefined,
    withInactive === 'true' ? 'with_inactive' as const : undefined,
  ].filter(Boolean);

  const [ searchTerm, setSearchTerm ] = React.useState<string>(q || '');
  const [ filterValue, setFilterValue ] = React.useState<EnsDomainLookupFiltersOptions>(initialFilters);
  const [ sort, setSort ] = React.useState<Sort>();

  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const isAddressSearch = React.useMemo(() => ADDRESS_REGEXP.test(debouncedSearchTerm), [ debouncedSearchTerm ]);
  const sortParam = sort?.split('-')[0];
  const orderParam = sort?.split('-')[1];

  const addressesLookupQuery = useApiQuery('addresses_lookup', {
    pathParams: { chainId: config.chain.id },
    queryParams: {
      address: debouncedSearchTerm,
      resolved_to: filterValue.includes('resolved_to'),
      owned_by: filterValue.includes('owned_by'),
      only_active: !filterValue.includes('with_inactive'),
      sort: sortParam,
      order: orderParam,
    },
    queryOptions: {
      enabled: isAddressSearch,
      placeholderData: generateListStub<'addresses_lookup'>(ENS_DOMAIN, 50, { next_page_params: null }),
    },
  });

  const domainsLookupQuery = useApiQuery('domains_lookup', {
    pathParams: { chainId: config.chain.id },
    queryParams: {
      name: debouncedSearchTerm,
      only_active: !filterValue.includes('with_inactive'),
      sort: sortParam,
      order: orderParam,
    },
    queryOptions: {
      enabled: !isAddressSearch,
      placeholderData: generateListStub<'domains_lookup'>(ENS_DOMAIN, 50, { next_page_params: null }),
    },
  });

  const query = isAddressSearch ? addressesLookupQuery : domainsLookupQuery;
  const { data, isError, isPlaceholderData: isLoading } = query;

  React.useEffect(() => {
    if (isAddressSearch && filterValue.filter((value) => value !== 'with_inactive').length === 0) {
      setFilterValue([ 'owned_by', 'resolved_to' ]);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ isAddressSearch ]);

  const handleSortToggle = React.useCallback((event: React.MouseEvent) => {
    if (isLoading) {
      return;
    }
    const field = (event.currentTarget as HTMLDivElement).getAttribute('data-field') as SortField | undefined;

    if (field) {
      setSort(getNextSortValue(field));
    }
  }, [ isLoading ]);

  const handleSearchTermChange = React.useCallback((value: string) => {
    setSearchTerm(value);
  }, []);

  const handleFilterValueChange = React.useCallback((value: EnsDomainLookupFiltersOptions) => {
    setFilterValue(value);
  }, []);

  const hasActiveFilters = Boolean(searchTerm);

  const content = (
    <>
      <Show below="lg" ssr={ false }>
        <Box>
          { data?.items.map((item, index) => (
            <NameDomainsListItem
              key={ item.id + (isLoading ? index : '') }
              { ...item }
              isLoading={ isLoading }
            />
          )) }
        </Box>
      </Show>
      <Hide below="lg" ssr={ false }>
        <NameDomainsTable
          data={ data }
          isLoading={ isLoading }
          sort={ sort }
          onSortToggle={ handleSortToggle }
        />
      </Hide>
    </>
  );

  const actionBar = (
    <NameDomainsActionBar
      isLoading={ isLoading }
      searchTerm={ searchTerm }
      onSearchChange={ handleSearchTermChange }
      filterValue={ filterValue }
      onFilterValueChange={ handleFilterValueChange }
      sort={ sort }
      onSortChange={ setSort }
      isAddressSearch={ isAddressSearch }
    />
  );

  return (
    <>
      <PageTitle title="ENS domains lookup" withTextAd/>
      <DataListDisplay
        isError={ isError }
        items={ data?.items }
        emptyText="There are no name domains."
        filterProps={{
          emptyFilteredText: `Couldn${ apos }t find name domains that match your filter query.`,
          hasActiveFilters,
        }}
        content={ content }
        actionBar={ actionBar }
      />
    </>
  );
};

export default NameDomains;
