import { Box, Hide, Show } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import type * as bens from '@blockscout/bens-types';

import config from 'configs/app';
import useApiQuery from 'lib/api/useApiQuery';
import getQueryParamString from 'lib/router/getQueryParamString';
import { ENS_DOMAIN_EVENT } from 'stubs/ENS';
import DataListDisplay from 'ui/shared/DataListDisplay';

import NameDomainHistoryListItem from './history/NameDomainHistoryListItem';
import NameDomainHistoryTable from './history/NameDomainHistoryTable';
import { getNextSortValue, type Sort, type SortField } from './history/utils';

interface Props {
  domain: bens.DetailedDomain | undefined;
}

const NameDomainHistory = ({ domain }: Props) => {
  const router = useRouter();
  const domainName = getQueryParamString(router.query.name);

  const [ sort, setSort ] = React.useState<Sort>();

  const { isPlaceholderData, isError, data } = useApiQuery('domain_events', {
    pathParams: { name: domainName, chainId: config.chain.id },
    queryOptions: {
      placeholderData: { items: Array(4).fill(ENS_DOMAIN_EVENT) },
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
          { data?.items.map((item, index) => (
            <NameDomainHistoryListItem
              key={ index }
              event={ item }
              domain={ domain }
              isLoading={ isPlaceholderData }
            />
          )) }
        </Box>
      </Show>
      <Hide below="lg" ssr={ false }>
        <NameDomainHistoryTable
          history={ data }
          domain={ domain }
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
