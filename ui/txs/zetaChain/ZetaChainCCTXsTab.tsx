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
import { zetaChainCCTX } from 'mocks/zetaChain/zetaChainCCTX';
import useApiQuery from 'lib/api/useApiQuery';
import ZetaChainCCTxs from './ZetaChainCCTxs';

const TABS_HEIGHT = 88;

const ZetaChainEvmTransactions = () => {
  const router = useRouter();
  const tab = getQueryParamString(router.query.tab);
  // const isMobile = useIsMobile();

  const cctxsValidatedQuery = useApiQuery('zetachain:transactions', {
    queryOptions: {
      placeholderData: { items: Array(50).fill(zetaChainCCTX) },
      enabled: !tab || tab === 'cross_chain' || tab === 'cctx_validated',
    },
    queryParams: {
      limit: 50,
      offset: 0,
      status_reduced: [ 'Success', 'Failed' ],
    },
  });

  const cctxsPendingQuery = useApiQuery('zetachain:transactions', {
    queryOptions: {
      placeholderData: { items: Array(50).fill(zetaChainCCTX) },
      enabled: tab === 'cctx_pending',
    },
    queryParams: {
      limit: 50,
      offset: 0,
      status_reduced: 'Pending',
    },
  });

  const verifiedTitle = capitalize(getNetworkValidationActionText());

  const tabs: Array<TabItemRegular> = [
    {
      id: 'cctx_validated',
      title: verifiedTitle,
      component:
        <ZetaChainCCTxs
          // pagination={ cctxsValidatedQuery.pagination }
          items={ cctxsValidatedQuery.data?.items }
          isPlaceholderData={ cctxsValidatedQuery.isPlaceholderData }
          isError={ cctxsValidatedQuery.isError }
          top={ TABS_HEIGHT }
        /> },
    {
      id: 'cctx_pending',
      title: 'Pending',
      component: (
        <ZetaChainCCTxs
          items={ cctxsPendingQuery.data?.items }
          isPlaceholderData={ cctxsPendingQuery.isPlaceholderData }
          isError={ cctxsPendingQuery.isError }
          top={ TABS_HEIGHT }
        />
      ),
    },
  ];

  // const pagination = (() => {
  //   switch (tab) {
  //     case 'zetachain_pending': return txsPendingQuery.pagination;
  //     default: return txsValidatedQuery.pagination;
  //   }
  // })();

  // const rightSlot = (() => {
  //   if (isMobile) {
  //     return null;
  //   }

  //   const isAdvancedFilterEnabled = config.features.advancedFilter.isEnabled;

  //   if (!isAdvancedFilterEnabled && !pagination.isVisible) {
  //     return null;
  //   }

  //   return (
  //     <Flex alignItems="center" gap={ 6 }>
  //       { isAdvancedFilterEnabled && (
  //         <Link
  //           href={ route({ pathname: '/advanced-filter' }) }
  //           alignItems="center"
  //           display="flex"
  //           gap={ 1 }
  //         >
  //           <IconSvg name="filter" boxSize={ 5 }/>
  //           Advanced filter
  //         </Link>
  //       ) }
  //       { pagination.isVisible && <Pagination my={ 1 } { ...pagination }/> }
  //     </Flex>
  //   );
  // })();

  return (
    <>
      <TxsStats/>
      <RoutedTabs
        tabs={ tabs }
        variant="secondary"
        size="sm"
        // rightSlot={ rightSlot }
      />
    </>
  );
};

export default ZetaChainEvmTransactions;
