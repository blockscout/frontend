import { useRouter } from 'next/router';
import React from 'react';

import type { TabItemRegular } from 'toolkit/components/AdaptiveTabs/types';

import { MultichainProvider } from 'lib/contexts/multichain';
import useRoutedChainSelect from 'lib/multichain/useRoutedChainSelect';
import getQueryParamString from 'lib/router/getQueryParamString';
import RoutedTabs from 'toolkit/components/RoutedTabs/RoutedTabs';
import ChainSelect from 'ui/shared/multichain/ChainSelect';
import PageTitle from 'ui/shared/Page/PageTitle';

import OpSuperchainTxsCrossChain from './OpSuperchainTxsCrossChain';
import OpSuperchainTxsLocal, { OP_SUPERCHAIN_TXS_LOCAL_TAB_IDS } from './OpSuperchainTxsLocal';

const TABS_RIGHT_SLOT_PROPS = {
  ml: { base: 'auto', lg: 6 },
};
const QUERY_PRESERVED_PARAMS = [ 'tab' ];

const OpSuperchainTxs = () => {
  const router = useRouter();
  const chainSelect = useRoutedChainSelect({ persistedParams: QUERY_PRESERVED_PARAMS });

  const tab = getQueryParamString(router.query.tab);
  const isLocalTxs = tab === 'txs_local' || OP_SUPERCHAIN_TXS_LOCAL_TAB_IDS.includes(tab);

  React.useEffect(() => {
    if (isLocalTxs && chainSelect.value) {
      const queryParam = getQueryParamString(router.query['chain-slug']);
      if (queryParam !== chainSelect.value[0]) {
        router.push({
          pathname: router.pathname,
          query: { tab: router.query.tab, 'chain-slug': chainSelect.value[0] },
        });
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ isLocalTxs ]);

  const tabs: Array<TabItemRegular> = React.useMemo(() => {
    return [
      {
        id: 'index',
        title: 'Cross-chain',
        component: <OpSuperchainTxsCrossChain/>,
      },
      {
        id: 'txs_local',
        title: 'Local',
        component: (
          <MultichainProvider chainSlug={ chainSelect.value?.[0] }>
            <OpSuperchainTxsLocal/>
          </MultichainProvider>
        ),
        subTabs: OP_SUPERCHAIN_TXS_LOCAL_TAB_IDS,
      },
    ];
  }, [ chainSelect.value ]);

  const rightSlot = isLocalTxs && (
    <ChainSelect
      value={ chainSelect.value }
      onValueChange={ chainSelect.onValueChange }
    />
  );

  return (
    <>
      <PageTitle
        withTextAd
        title="Transactions"
      />
      <RoutedTabs
        tabs={ tabs }
        rightSlot={ rightSlot }
        rightSlotProps={ rightSlot ? TABS_RIGHT_SLOT_PROPS : undefined }
      />
    </>
  );
};

export default React.memo(OpSuperchainTxs);
