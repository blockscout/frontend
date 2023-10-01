import { useRouter } from 'next/router';
import React from 'react';

// import type { PaginationParams } from 'ui/shared/pagination/types';
// import type { RoutedTab } from 'ui/shared/Tabs/types';

// import config from 'configs/app';
import useApiQuery from 'lib/api/useApiQuery';
import { useAppContext } from 'lib/contexts/app';
// import useIsMobile from 'lib/hooks/useIsMobile';
import getQueryParamString from 'lib/router/getQueryParamString';
import { ZKEVM_L2_TXN_BATCH } from 'stubs/zkEvmL2';
// import { TX } from 'stubs/tx';
// import { generateListStub } from 'stubs/utils';
import TextAd from 'ui/shared/ad/TextAd';
import PageTitle from 'ui/shared/Page/PageTitle';
import ZkEvmL2TxnBatchDetails from 'ui/zkEvmL2TxnBatches/ZkEvmL2TxnBatchDetails';
// import Pagination from 'ui/shared/pagination/Pagination';
// import useQueryWithPages from 'ui/shared/pagination/useQueryWithPages';
// import RoutedTabs from 'ui/shared/Tabs/RoutedTabs';
// import TabsSkeleton from 'ui/shared/Tabs/TabsSkeleton';
// import TxsContent from 'ui/txs/TxsContent';

// const TAB_LIST_PROPS = {
//   marginBottom: 0,
//   py: 5,
//   marginTop: -5,
// };

const ZkEvmL2TxnBatch = () => {
  const router = useRouter();
  // const isMobile = useIsMobile();
  const appProps = useAppContext();
  const number = getQueryParamString(router.query.number);
  // const tab = getQueryParamString(router.query.tab);

  const batchQuery = useApiQuery('zkevm_l2_txn_batch', {
    pathParams: { number },
    queryOptions: {
      enabled: Boolean(number),
      placeholderData: ZKEVM_L2_TXN_BATCH,
    },
  });

  // const blockTxsQuery = useQueryWithPages({
  //   resourceName: 'batch_txs',
  //   pathParams: { height_or_hash: heightOrHash },
  //   options: {
  //     enabled: Boolean(!blockQuery.isPlaceholderData && blockQuery.data?.height && tab === 'txs'),
  //     placeholderData: generateListStub<'block_txs'>(TX, 50, { next_page_params: {
  //       block_number: 9004925,
  //       index: 49,
  //       items_count: 50,
  //     } }),
  //   },
  // });

  if (!number) {
    throw new Error('Tx batch not found', { cause: { status: 404 } });
  }

  if (batchQuery.isError) {
    throw new Error(undefined, { cause: batchQuery.error });
  }

  // const tabs: Array<RoutedTab> = React.useMemo(() => ([
  //   { id: 'index', title: 'Details', component: <BlockDetails query={ blockQuery }/> },
  //   { id: 'txs', title: 'Transactions', component: <TxsContent query={ blockTxsQuery } showBlockInfo={ false } showSocketInfo={ false }/> },
  // ].filter(Boolean)), [ blockQuery, blockTxsQuery, blockWithdrawalsQuery ]);

  // const hasPagination = !isMobile && (
  //   (tab === 'txs' && blockTxsQuery.pagination.isVisible) ||
  //   (tab === 'withdrawals' && blockWithdrawalsQuery.pagination.isVisible)
  // );

  // let pagination;
  // if (tab === 'txs') {
  //   pagination = blockTxsQuery.pagination;
  // } else if (tab === 'withdrawals') {
  //   pagination = blockWithdrawalsQuery.pagination;
  // }

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
      { /* { batchQuery.isPlaceholderData ? <TabsSkeleton tabs={ tabs }/> : (
        <RoutedTabs
          tabs={ tabs }
          tabListProps={ isMobile ? undefined : TAB_LIST_PROPS }
          rightSlot={ hasPagination ? <Pagination { ...(pagination as PaginationParams) }/> : null }
          stickyEnabled={ hasPagination }
        />
      ) } */ }
      <ZkEvmL2TxnBatchDetails query={ batchQuery }/>
    </>
  );
};

export default ZkEvmL2TxnBatch;
