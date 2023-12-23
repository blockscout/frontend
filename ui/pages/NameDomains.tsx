import { Box, Hide, Show } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import type { EnsDomainLookupFiltersOptions } from 'types/api/ens';

import config from 'configs/app';
import useApiQuery from 'lib/api/useApiQuery';
import useDebounce from 'lib/hooks/useDebounce';
import { apos } from 'lib/html-entities';
import getQueryParamString from 'lib/router/getQueryParamString';
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

  const address = getQueryParamString(router.query.address);
  const ownedBy = getQueryParamString(router.query.ownedBy);
  const resolvedTo = getQueryParamString(router.query.resolvedTo);
  const withInactive = getQueryParamString(router.query.withInactive);

  const initialFilters: EnsDomainLookupFiltersOptions = [
    ownedBy === 'true' ? 'ownedBy' as const : undefined,
    resolvedTo === 'true' ? 'resolvedTo' as const : undefined,
    withInactive === 'true' ? 'withInactive' as const : undefined,
  ].filter(Boolean);

  const [ searchTerm, setSearchTerm ] = React.useState<string>(address ?? '');
  const [ filterValue, setFilterValue ] = React.useState<EnsDomainLookupFiltersOptions>(initialFilters);
  const [ sort, setSort ] = React.useState<Sort>();

  const debouncedSearchTerm = useDebounce(searchTerm || '', 300);

  const { isError, isPlaceholderData, data } = useApiQuery('addresses_lookup', {
    pathParams: { chainId: config.chain.id },
    fetchParams: {
      method: 'POST',
      body: {
        address: debouncedSearchTerm,
        resolvedTo: true,
        ownedBy: true,
        onlyActive: true,
        sort: 'registration_date',
        order: 'ASC',
      },
    },
    queryOptions: {
      placeholderData: generateListStub<'addresses_lookup'>(ENS_DOMAIN, 50, { totalRecords: 50 }),
    },
  });

  const handleSortToggle = React.useCallback((event: React.MouseEvent) => {
    if (isPlaceholderData) {
      return;
    }
    const field = (event.currentTarget as HTMLDivElement).getAttribute('data-field') as SortField | undefined;

    if (field) {
      setSort(getNextSortValue(field));
    }
  }, [ isPlaceholderData ]);

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
              key={ item.id + (isPlaceholderData ? index : '') }
              { ...item }
              isLoading={ isPlaceholderData }
            />
          )) }
        </Box>
      </Show>
      <Hide below="lg" ssr={ false }>
        <NameDomainsTable
          data={ data }
          isLoading={ isPlaceholderData }
          sort={ sort }
          onSortToggle={ handleSortToggle }
        />
      </Hide>
    </>
  );

  const actionBar = (
    <NameDomainsActionBar
      isLoading={ isPlaceholderData }
      searchTerm={ searchTerm }
      onSearchChange={ handleSearchTermChange }
      filterValue={ filterValue }
      onFilterValueChange={ handleFilterValueChange }
      sort={ sort }
      onSortChange={ setSort }
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
