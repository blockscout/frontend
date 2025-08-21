import { Flex } from '@chakra-ui/react';
import { capitalize } from 'es-toolkit/compat';
import { useRouter } from 'next/router';
import React from 'react';

import type { TabItemRegular } from 'toolkit/components/AdaptiveTabs/types';

import { route } from 'nextjs-routes';

import config from 'configs/app';
import useIsMobile from 'lib/hooks/useIsMobile';
import getNetworkValidationActionText from 'lib/networks/getNetworkValidationActionText';
import getQueryParamString from 'lib/router/getQueryParamString';
import { TX } from 'stubs/tx';
import { generateListStub } from 'stubs/utils';
import { Link } from 'toolkit/chakra/link';
import RoutedTabs from 'toolkit/components/RoutedTabs/RoutedTabs';
import IconSvg from 'ui/shared/IconSvg';
import Pagination from 'ui/shared/pagination/Pagination';
import useQueryWithPages from 'ui/shared/pagination/useQueryWithPages';
import TxsStats from 'ui/txs/TxsStats';

import TxsWithFrontendSorting from '../TxsWithFrontendSorting';

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

  const verifiedTitle = capitalize(getNetworkValidationActionText());

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
        { isAdvancedFilterEnabled && (
          <Link
            href={ route({ pathname: '/advanced-filter' }) }
            alignItems="center"
            display="flex"
            gap={ 1 }
          >
            <IconSvg name="filter" boxSize={ 5 }/>
            Advanced filter
          </Link>
        ) }
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
