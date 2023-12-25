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
  const ownedBy = getQueryParamString(router.query.ownedBy);
  const resolvedTo = getQueryParamString(router.query.resolvedTo);
  const withInactive = getQueryParamString(router.query.withInactive);

  const initialFilters: EnsDomainLookupFiltersOptions = [
    ownedBy === 'true' ? 'ownedBy' as const : undefined,
    resolvedTo === 'true' ? 'resolvedTo' as const : undefined,
    withInactive === 'true' ? 'withInactive' as const : undefined,
  ].filter(Boolean);

  const [ searchTerm, setSearchTerm ] = React.useState<string>(q || '');
  const [ filterValue, setFilterValue ] = React.useState<EnsDomainLookupFiltersOptions>(initialFilters);
  const [ sort, setSort ] = React.useState<Sort>();

  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const isAddressSearch = React.useMemo(() => ADDRESS_REGEXP.test(debouncedSearchTerm), [ debouncedSearchTerm ]);
  const sortParam = sort?.split('-')[0];
  const orderParam = sort?.split('-')[1].toUpperCase();

  const addressesLookupQuery = useApiQuery('addresses_lookup', {
    pathParams: { chainId: config.chain.id },
    fetchParams: {
      method: 'POST',
      body: {
        address: debouncedSearchTerm,
        resolvedTo: filterValue.includes('resolvedTo'),
        ownedBy: filterValue.includes('ownedBy'),
        onlyActive: !filterValue.includes('withInactive'),
        sort: sortParam,
        order: orderParam,
      },
    },
    queryOptions: {
      enabled: isAddressSearch,
      placeholderData: generateListStub<'addresses_lookup'>(ENS_DOMAIN, 50, { totalRecords: 50 }),
    },
  });

  const domainsLookupQuery = useApiQuery('domains_lookup', {
    pathParams: { chainId: config.chain.id },
    fetchParams: {
      method: 'POST',
      body: {
        name: debouncedSearchTerm,
        onlyActive: !filterValue.includes('withInactive'),
        sort: sortParam,
        order: orderParam,
      },
    },
    queryOptions: {
      enabled: !isAddressSearch,
      placeholderData: generateListStub<'domains_lookup'>(ENS_DOMAIN, 50, { totalRecords: 50 }),
    },
  });

  const query = isAddressSearch ? addressesLookupQuery : domainsLookupQuery;
  const { data, isError, isPlaceholderData: isLoading } = query;

  React.useEffect(() => {
    if (isAddressSearch && filterValue.filter((value) => value !== 'withInactive').length === 0) {
      setFilterValue([ 'ownedBy', 'resolvedTo' ]);
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
