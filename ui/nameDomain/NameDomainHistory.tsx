import { Box, Hide, Show } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import config from 'configs/app';
import useApiQuery from 'lib/api/useApiQuery';
import getQueryParamString from 'lib/router/getQueryParamString';
import { ENS_DOMAIN_EVENT } from 'stubs/ENS';
import { generateListStub } from 'stubs/utils';
import DataListDisplay from 'ui/shared/DataListDisplay';

import NameDomainHistoryListItem from './history/NameDomainHistoryListItem';
import NameDomainHistoryTable from './history/NameDomainHistoryTable';
import { getNextSortValue, type Sort, type SortField } from './history/utils';

const NameDomainHistory = () => {
  const router = useRouter();
  const domainName = getQueryParamString(router.query.name);

  const [ sort, setSort ] = React.useState<Sort>();

  const { isPlaceholderData, isError, data } = useApiQuery('domain_events', {
    pathParams: { name: domainName, chainId: config.chain.id },
    queryOptions: {
      placeholderData: generateListStub<'domain_events'>(ENS_DOMAIN_EVENT, 4, { totalRecords: 4 }),
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

  const content = (
    <>
      <Show below="lg" ssr={ false }>
        <Box>
          { data?.items.map((item, index) => <NameDomainHistoryListItem key={ index } { ...item } isLoading={ isPlaceholderData }/>) }
        </Box>
      </Show>
      <Hide below="lg" ssr={ false }>
        <NameDomainHistoryTable
          data={ data }
          isLoading={ isPlaceholderData }
          sort={ sort }
          onSortToggle={ handleSortToggle }
        />
      </Hide>
    </>
  );

  return (
    <DataListDisplay
      isError={ isError }
      items={ data?.items }
      emptyText="There are no events for this domain."
      content={ content }
    />
  );
};

export default React.memo(NameDomainHistory);
