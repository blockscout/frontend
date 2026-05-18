// SPDX-License-Identifier: LicenseRef-Blockscout

import { Flex } from '@chakra-ui/react';
import { capitalize } from 'es-toolkit/compat';
import { useRouter } from 'next/router';
import React from 'react';

import type { TabItemRegular } from 'toolkit/components/AdaptiveTabs/types';

import TxsWithFrontendSorting from 'client/slices/tx/pages/index/list/TxsWithFrontendSorting';
import TxsStats from 'client/slices/tx/pages/index/stats/TxsStats';
import { TX } from 'client/slices/tx/stubs/tx';

import getChainValidationActionText from 'client/shared/chain/get-chain-validation-action-text';
import useIsMobile from 'client/shared/hooks/useIsMobile';
import getQueryParamString from 'client/shared/router/get-query-param-string';

import config from 'configs/app';
import { generateListStub } from 'stubs/utils';
import RoutedTabs from 'toolkit/components/RoutedTabs/RoutedTabs';
import AdvancedFilterLink from 'ui/shared/links/AdvancedFilterLink';
import Pagination from 'ui/shared/pagination/Pagination';
import useQueryWithPages from 'ui/shared/pagination/useQueryWithPages';

const TAB_LIST_PROPS = {
  marginBottom: 0,
  pt: 6,
  pb: 6,
  marginTop: -5,
};
const TABS_HEIGHT = 88;

const ZetaChainEvmTransactions = () => {
  const router = useRouter();
  const tab = getQueryParamString(router.query.tab);
  const isMobile = useIsMobile();

  const txsValidatedQuery = useQueryWithPages({
    resourceName: 'general:txs_validated',
    filters: { filter: 'validated' },
    options: {
      enabled: !tab || tab === 'zetachain' || tab === 'zetachain_validated',
      placeholderData: generateListStub<'general:txs_validated'>(TX, 50, { next_page_params: {
        block_number: 9005713,
        index: 5,
        items_count: 50,
        filter: 'validated',
      } }),
    },
  });

  const txsPendingQuery = useQueryWithPages({
    resourceName: 'general:txs_pending',
    filters: { filter: 'pending' },
    options: {
      enabled: tab === 'zetachain_pending',
      placeholderData: generateListStub<'general:txs_pending'>(TX, 50, { next_page_params: {
        inserted_at: '2024-02-05T07:04:47.749818Z',
        hash: '0x00',
        filter: 'pending',
      } }),
    },
  });

  const verifiedTitle = capitalize(getChainValidationActionText());

  const tabs: Array<TabItemRegular> = [
    {
      id: 'zetachain_validated',
      title: verifiedTitle,
      component:
        <TxsWithFrontendSorting
          query={ txsValidatedQuery }
          socketType="txs_validated"
          top={ TABS_HEIGHT }
        /> },
    {
      id: 'zetachain_pending',
      title: 'Pending',
      component: (
        <TxsWithFrontendSorting
          query={ txsPendingQuery }
          showBlockInfo={ false }
          socketType="txs_pending"
          top={ TABS_HEIGHT }
        />
      ),
    },
  ];

  const pagination = (() => {
    switch (tab) {
      case 'zetachain_pending': return txsPendingQuery.pagination;
      default: return txsValidatedQuery.pagination;
    }
  })();

  const rightSlot = (() => {
    if (isMobile) {
      return null;
    }

    const isAdvancedFilterEnabled = config.features.advancedFilter.isEnabled;

    if (!isAdvancedFilterEnabled && !pagination.isVisible) {
      return null;
    }

    return (
      <Flex alignItems="center" gap={ 6 }>
        { isAdvancedFilterEnabled && <AdvancedFilterLink/> }
        { pagination.isVisible && <Pagination my={ 1 } { ...pagination }/> }
      </Flex>
    );
  })();

  return (
    <>
      <TxsStats/>
      <RoutedTabs
        tabs={ tabs }
        variant="secondary"
        size="sm"
        rightSlot={ rightSlot }
        stickyEnabled={ !isMobile }
        listProps={ isMobile ? undefined : TAB_LIST_PROPS }
      />
    </>
  );
};

export default ZetaChainEvmTransactions;
