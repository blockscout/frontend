import { Box, Hide, Show } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import config from 'configs/app';
import useApiQuery from 'lib/api/useApiQuery';
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

  const q = getQueryParamString(router.query.q);

  const [ searchTerm, setSearchTerm ] = React.useState<string>(q ?? '');
  const [ sort, setSort ] = React.useState<Sort>();

  const { isError, isPlaceholderData, data } = useApiQuery('domains_lookup', {
    pathParams: { chainId: config.chain.id },
    fetchParams: {
      method: 'POST',
      body: {
        name: 'pepecat🐾.eth',
        onlyActive: true,
        sort: 'registration_date',
        order: 'ASC',
      },
    },
    queryOptions: {
      placeholderData: generateListStub<'domains_lookup'>(ENS_DOMAIN, 50, { totalRecords: 50 }),
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
      searchTerm={ searchTerm }
      onSearchChange={ handleSearchTermChange }
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
