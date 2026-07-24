// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import type * as bens from '@blockscout/bens-types';

import useApiQuery from 'src/api/hooks/useApiQuery';

import { ENS_DOMAIN_EVENT } from 'src/features/name-services/domains/stubs';

import config from 'src/config';
import DataList from 'src/shared/lists/DataList';
import getQueryParamString from 'src/shared/router/get-query-param-string';

import NameDomainHistoryList from './NameDomainHistoryList';
import NameDomainHistoryTable from './NameDomainHistoryTable';
import { getNextSortValue, type Sort, type SortField } from './utils';

const feature = config.features.nameServices;
const availableProtocols = feature.isEnabled && feature.ens.isEnabled ? feature.ens.protocols : [];

interface Props {
  domain: bens.DetailedDomain | undefined;
}

const NameDomainHistory = ({ domain }: Props) => {
  const router = useRouter();
  const domainName = getQueryParamString(router.query.name);
  const protocolId = getQueryParamString(router.query.protocol_id) || availableProtocols[0];

  const [ sort, setSort ] = React.useState<Sort>('default');

  const { isPlaceholderData, isError, data } = useApiQuery('bens:domain_events', {
    pathParams: { name: domainName },
    queryParams: {
      protocol_id: protocolId,
    },
    queryOptions: {
      placeholderData: { items: Array(4).fill(ENS_DOMAIN_EVENT) },
    },
  });

  const handleSortToggle = React.useCallback((field: SortField) => {
    if (isPlaceholderData) {
      return;
    }

    if (field) {
      setSort(getNextSortValue(field));
    }
  }, [ isPlaceholderData ]);

  const content = data?.items ? (
    <>
      <Box hideFrom="lg">
        <NameDomainHistoryList
          items={ data.items }
          domain={ domain }
          isLoading={ isPlaceholderData }
        />
      </Box>
      <Box hideBelow="lg">
        <NameDomainHistoryTable
          items={ data.items }
          domain={ domain }
          isLoading={ isPlaceholderData }
          sort={ sort }
          onSortToggle={ handleSortToggle }
        />
      </Box>
    </>
  ) : null;

  return (
    <DataList
      isError={ isError }
      itemsNum={ data?.items.length }
      emptyText="There are no events for this domain."
    >
      { content }
    </DataList>
  );
};

export default React.memo(NameDomainHistory);
