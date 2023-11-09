import { useRouter } from 'next/router';
import React from 'react';

import type { RoutedTab } from 'ui/shared/Tabs/types';

import useApiQuery from 'lib/api/useApiQuery';
import { useAppContext } from 'lib/contexts/app';
import getQueryParamString from 'lib/router/getQueryParamString';
import { TX_ZKEVM_L2 } from 'stubs/tx';
import { generateListStub } from 'stubs/utils';
import { ZKEVM_L2_TXN_BATCH } from 'stubs/zkEvmL2';
import TextAd from 'ui/shared/ad/TextAd';
import PageTitle from 'ui/shared/Page/PageTitle';
import useQueryWithPages from 'ui/shared/pagination/useQueryWithPages';
import RoutedTabs from 'ui/shared/Tabs/RoutedTabs';
import TabsSkeleton from 'ui/shared/Tabs/TabsSkeleton';
import TxsContent from 'ui/txs/TxsContent';
import ZkEvmL2TxnBatchDetails from 'ui/zkEvmL2TxnBatches/ZkEvmL2TxnBatchDetails';

const ZkEvmL2TxnBatch = () => {
  const router = useRouter();
  const appProps = useAppContext();
  const number = getQueryParamString(router.query.number);
  const tab = getQueryParamString(router.query.tab);

  const batchQuery = useApiQuery('zkevm_l2_txn_batch', {
    pathParams: { number },
    queryOptions: {
      enabled: Boolean(number),
      placeholderData: ZKEVM_L2_TXN_BATCH,
    },
  });

  const batchTxsQuery = useQueryWithPages({
    resourceName: 'zkevm_l2_txn_batch_txs',
    pathParams: { number },
    options: {
      enabled: Boolean(!batchQuery.isPlaceholderData && batchQuery.data?.number && tab === 'txs'),
      // there is no pagination in zkevm_l2_txn_batch_txs
      placeholderData: generateListStub<'zkevm_l2_txn_batch_txs'>(TX_ZKEVM_L2, 50, { next_page_params: null }),
    },
  });

  if (!number) {
    throw new Error('Tx batch not found', { cause: { status: 404 } });
  }

  if (batchQuery.isError) {
    throw new Error(undefined, { cause: batchQuery.error });
  }

  const tabs: Array<RoutedTab> = React.useMemo(() => ([
    { id: 'index', title: 'Details', component: <ZkEvmL2TxnBatchDetails query={ batchQuery }/> },
    { id: 'txs', title: 'Transactions', component: <TxsContent query={ batchTxsQuery } showSocketInfo={ false }/> },
  ].filter(Boolean)), [ batchQuery, batchTxsQuery ]);

  const backLink = React.useMemo(() => {
    const hasGoBackLink = appProps.referrer && appProps.referrer.includes('/zkevm_l2_txn_batches');

    if (!hasGoBackLink) {
      return;
    }

    return {
      label: 'Back to tx batches list',
      url: appProps.referrer,
    };
  }, [ appProps.referrer ]);

  return (
    <>
      <TextAd mb={ 6 }/>
      <PageTitle
        title={ `Tx batch #${ number }` }
        backLink={ backLink }
      />
      { batchQuery.isPlaceholderData ? <TabsSkeleton tabs={ tabs }/> : (
        <RoutedTabs
          tabs={ tabs }
        />
      ) }
    </>
  );
};

export default ZkEvmL2TxnBatch;
