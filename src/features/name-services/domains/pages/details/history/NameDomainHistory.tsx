// SPDX-License-Identifier: LicenseRef-Blockscout

import { createListCollection } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import type * as bens from '@blockscout/bens-types';

import useApiQuery from 'src/api/hooks/useApiQuery';

import ActionBar from 'src/shell/page/action-bar/ActionBar';

import { ENS_DOMAIN_EVENT } from 'src/features/name-services/domains/stubs';

import config from 'src/config';
import useIsMobile from 'src/shared/hooks/useIsMobile';
import DataList from 'src/shared/lists/DataList';
import getQueryParamString from 'src/shared/router/get-query-param-string';
import Sort from 'src/shared/sort/Sort';

import { TableContainerScrollable } from 'src/toolkit/chakra/table';

import NameDomainHistoryTable from './NameDomainHistoryTable';
import { getNextSortValue, SORT_OPTIONS, type Sort as SortValue, type SortField } from './utils';

const feature = config.features.nameServices;
const availableProtocols = feature.isEnabled && feature.ens.isEnabled ? feature.ens.protocols : [];

const sortCollection = createListCollection({
  items: SORT_OPTIONS,
});

interface Props {
  domain: bens.DetailedDomain | undefined;
}

const NameDomainHistory = ({ domain }: Props) => {
  const router = useRouter();
  const isMobile = useIsMobile();
  const domainName = getQueryParamString(router.query.name);
  const protocolId = getQueryParamString(router.query.protocol_id) || availableProtocols[0];

  const [ sort, setSort ] = React.useState<SortValue>('default');

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

  const handleSortValueChange = React.useCallback(({ value }: { value: Array<string> }) => {
    setSort(value[0] as SortValue);
  }, []);

  const content = data?.items ? (
    <TableContainerScrollable>
      <NameDomainHistoryTable
        items={ data.items }
        domain={ domain }
        isLoading={ isPlaceholderData }
        sort={ sort }
        onSortToggle={ handleSortToggle }
      />
    </TableContainerScrollable>
  ) : null;

  const actionBar = isMobile ? (
    <ActionBar mt={ -6 }>
      <Sort
        name="name_domain_history_sorting"
        defaultValue={ [ sort ] }
        collection={ sortCollection }
        onValueChange={ handleSortValueChange }
        isLoading={ isPlaceholderData }
        hideFrom="lg"
      />
    </ActionBar>
  ) : null;

  return (
    <DataList
      isError={ isError }
      itemsNum={ data?.items.length }
      emptyText="There are no events for this domain."
      actionBar={ actionBar }
    >
      { content }
    </DataList>
  );
};

export default React.memo(NameDomainHistory);
