import { inRange } from 'lodash';
import { useRouter } from 'next/router';
import React from 'react';

import type { Log } from 'types/api/log';
import type { TokenTransfer } from 'types/api/tokenTransfer';
import type { RoutedTab } from 'ui/shared/Tabs/types';

import useApiQuery from 'lib/api/useApiQuery';
import { useAppContext } from 'lib/contexts/app';
import getQueryParamString from 'lib/router/getQueryParamString';
import { USER_OP } from 'stubs/userOps';
import TextAd from 'ui/shared/ad/TextAd';
import UserOpEntity from 'ui/shared/entities/userOp/UserOpEntity';
import PageTitle from 'ui/shared/Page/PageTitle';
import RoutedTabs from 'ui/shared/Tabs/RoutedTabs';
import TabsSkeleton from 'ui/shared/Tabs/TabsSkeleton';
import useTabIndexFromQuery from 'ui/shared/Tabs/useTabIndexFromQuery';
import TxLogs from 'ui/tx/TxLogs';
import TxTokenTransfer from 'ui/tx/TxTokenTransfer';
import UserOpCallData from 'ui/userOp/UserOpCallData';
import UserOpDetails from 'ui/userOp/UserOpDetails';
import UserOpRaw from 'ui/userOp/UserOpRaw';

const BlockPageContent = () => {
  const router = useRouter();
  const appProps = useAppContext();
  const hash = getQueryParamString(router.query.hash);

  const userOpQuery = useApiQuery('user_op', {
    pathParams: { hash: hash },
    queryOptions: {
      enabled: Boolean(hash),
      placeholderData: USER_OP,
    },
  });

  const filterTokenTransfersByLogIndex = React.useCallback((tt: TokenTransfer) => {
    if (!userOpQuery.data) {
      return true;
    } else {
      if (inRange(Number(tt.log_index), userOpQuery.data.user_logs_start_index, userOpQuery.data.user_logs_start_index + userOpQuery.data.user_logs_count)) {
        return true;
      }
      return false;
    }
  }, [ userOpQuery.data ]);

  const filterLogsByLogIndex = React.useCallback((log: Log) => {
    if (!userOpQuery.data) {
      return true;
    } else {
      if (inRange(log.index, userOpQuery.data.user_logs_start_index, userOpQuery.data.user_logs_start_index + userOpQuery.data.user_logs_count)) {
        return true;
      }
      return false;
    }
  }, [ userOpQuery.data ]);

  const tabs: Array<RoutedTab> = React.useMemo(() => ([
    { id: 'index', title: 'Details', component: <UserOpDetails query={ userOpQuery }/> },
    {
      id: 'token_transfers',
      title: 'Token transfers',
      component: <TxTokenTransfer txHash={ userOpQuery.data?.transaction_hash } tokenTransferFilter={ filterTokenTransfersByLogIndex }/>,
    },
    {
      id: 'call_data',
      title: 'Call data',
      component: <UserOpCallData rawCallData={ userOpQuery.data?.call_data } isLoading={ userOpQuery.isPlaceholderData }/>,
    },
    { id: 'logs', title: 'Logs', component: <TxLogs txHash={ userOpQuery.data?.transaction_hash } logsFilter={ filterLogsByLogIndex }/> },
    { id: 'raw', title: 'Raw', component: <UserOpRaw query={ userOpQuery }/> },
  ].filter(Boolean)), [ userOpQuery, filterTokenTransfersByLogIndex, filterLogsByLogIndex ]);

  const tabIndex = useTabIndexFromQuery(tabs);

  if (!hash) {
    throw new Error('User operation not found', { cause: { status: 404 } });
  }

  if (userOpQuery.isError) {
    throw new Error(undefined, { cause: userOpQuery.error });
  }

  const backLink = React.useMemo(() => {
    const hasGoBackLink = appProps.referrer && appProps.referrer.includes('/ops');

    if (!hasGoBackLink) {
      return;
    }

    return {
      label: 'Back to user operations list',
      url: appProps.referrer,
    };
  }, [ appProps.referrer ]);

  const titleSecondRow = <UserOpEntity hash={ hash } noLink noCopy={ false } fontWeight={ 500 } fontFamily="heading" iconSize="lg"/>;

  return (
    <>
      <TextAd mb={ 6 }/>
      <PageTitle
        title="User operation details"
        backLink={ backLink }
        secondRow={ titleSecondRow }
      />
      { userOpQuery.isPlaceholderData ? (
        <>
          <TabsSkeleton tabs={ tabs } mt={ 6 }/>
          { tabs[tabIndex]?.component }
        </>
      ) :
        <RoutedTabs tabs={ tabs }/> }
    </>
  );
};

export default BlockPageContent;
