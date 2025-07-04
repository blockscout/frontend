import { useRouter } from 'next/router';
import React from 'react';

import type { TabItemRegular } from 'toolkit/components/AdaptiveTabs/types';

import { MultichainProvider } from 'lib/contexts/multichain';
import getChainValueFromQuery from 'lib/multichain/getChainValueFromQuery';
import getQueryParamString from 'lib/router/getQueryParamString';
import RoutedTabs from 'toolkit/components/RoutedTabs/RoutedTabs';
import ChainSelect from 'ui/shared/multichain/ChainSelect';
import PageTitle from 'ui/shared/Page/PageTitle';

import OpSuperchainTxsLocal, { OP_SUPERCHAIN_TXS_LOCAL_TAB_IDS } from './OpSuperchainTxsLocal';

const TABS_RIGHT_SLOT_PROPS = {
  ml: { base: 'auto', lg: 6 },
};

const OpSuperchainTxs = () => {
  const router = useRouter();

  const [ chainValue, setChainValue ] = React.useState<Array<string> | undefined>(
    [ getChainValueFromQuery(router.query) ].filter(Boolean),
  );

  const tab = getQueryParamString(router.query.tab);
  const isLocalTxs = tab === 'local_txs' || OP_SUPERCHAIN_TXS_LOCAL_TAB_IDS.includes(tab);

  const isLoading = false;

  const handleChainValueChange = React.useCallback(({ value }: { value: Array<string> }) => {
    setChainValue(value);
    router.push({
      pathname: router.pathname,
      query: { tab: router.query.tab, 'chain-slug': value[0] },
    });
  }, [ router ]);

  React.useEffect(() => {
    if (isLocalTxs && chainValue) {
      const queryParam = getQueryParamString(router.query['chain-slug']);
      if (queryParam !== chainValue[0]) {
        router.push({
          pathname: router.pathname,
          query: { tab: router.query.tab, 'chain-slug': chainValue[0] },
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
        component: <div>Coming soon 🔜</div>,
      },
      {
        id: 'local_txs',
        title: 'Local',
        component: (
          <MultichainProvider chainSlug={ chainValue?.[0] }>
            <OpSuperchainTxsLocal/>
          </MultichainProvider>
        ),
        subTabs: OP_SUPERCHAIN_TXS_LOCAL_TAB_IDS,
      },
    ];
  }, [ chainValue ]);

  const rightSlot = isLocalTxs && (
    <ChainSelect
      value={ chainValue }
      onValueChange={ handleChainValueChange }
    />
  );

  return (
    <>
      <PageTitle
        withTextAd
        title="Transactions"
        isLoading={ isLoading }
      />
      <RoutedTabs
        tabs={ tabs }
        isLoading={ isLoading }
        listProps={ isLocalTxs ? { mb: 0 } : undefined }
        rightSlot={ rightSlot }
        rightSlotProps={ rightSlot ? TABS_RIGHT_SLOT_PROPS : undefined }
      />
    </>
  );
};

export default React.memo(OpSuperchainTxs);
