import _inRange from 'lodash/inRange';
import { useRouter } from 'next/router';
import React from 'react';

import type { Log } from 'types/api/log';
import type { TokenTransfer } from 'types/api/tokenTransfer';
import type { RoutedTab } from 'ui/shared/Tabs/types';

import useApiQuery from 'lib/api/useApiQuery';
import { useAppContext } from 'lib/contexts/app';
import throwOnAbsentParamError from 'lib/errors/throwOnAbsentParamError';
import throwOnResourceLoadError from 'lib/errors/throwOnResourceLoadError';
import getQueryParamString from 'lib/router/getQueryParamString';
import { USER_OP } from 'stubs/userOps';
import TextAd from 'ui/shared/ad/TextAd';
import PageTitle from 'ui/shared/Page/PageTitle';
import RoutedTabs from 'ui/shared/Tabs/RoutedTabs';
import TabsSkeleton from 'ui/shared/Tabs/TabsSkeleton';
import useTabIndexFromQuery from 'ui/shared/Tabs/useTabIndexFromQuery';
import TxLogs from 'ui/tx/TxLogs';
import TxTokenTransfer from 'ui/tx/TxTokenTransfer';
import useTxQuery from 'ui/tx/useTxQuery';
import UserOpDetails from 'ui/userOp/UserOpDetails';
import UserOpRaw from 'ui/userOp/UserOpRaw';
import UserOpSubHeading from 'ui/userOp/UserOpSubHeading';

const UserOp = () => {
  const router = useRouter();
  const appProps = useAppContext();
  const hash = getQueryParamString(router.query.hash);

  const userOpQuery = useApiQuery('user_op', {
    pathParams: { hash },
    queryOptions: {
      enabled: Boolean(hash),
      placeholderData: USER_OP,
    },
  });

  const txQuery = useTxQuery({ hash: userOpQuery.data?.transaction_hash, isEnabled: !userOpQuery.isPlaceholderData });

  const filterTokenTransfersByLogIndex = React.useCallback((tt: TokenTransfer) => {
    if (!userOpQuery.data) {
      return true;
    } else {
      if (_inRange(
        Number(tt.log_index),
        userOpQuery.data?.user_logs_start_index,
        userOpQuery.data?.user_logs_start_index + userOpQuery.data?.user_logs_count,
      )) {
        return true;
      }
      return false;
    }
  }, [ userOpQuery.data ]);

  const filterLogsByLogIndex = React.useCallback((log: Log) => {
    if (!userOpQuery.data) {
      return true;
    } else {
      if (_inRange(log.index, userOpQuery.data?.user_logs_start_index, userOpQuery.data?.user_logs_start_index + userOpQuery.data?.user_logs_count)) {
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
      component: <TxTokenTransfer txQuery={ txQuery } tokenTransferFilter={ filterTokenTransfersByLogIndex }/>,
    },
    { id: 'logs', title: 'Logs', component: <TxLogs txQuery={ txQuery } logsFilter={ filterLogsByLogIndex }/> },
    { id: 'raw', title: 'Raw', component: <UserOpRaw rawData={ userOpQuery.data?.raw } isLoading={ userOpQuery.isPlaceholderData }/> },
  ]), [ userOpQuery, txQuery, filterTokenTransfersByLogIndex, filterLogsByLogIndex ]);

  const tabIndex = useTabIndexFromQuery(tabs);

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

  throwOnAbsentParamError(hash);
  throwOnResourceLoadError(userOpQuery);

  const titleSecondRow = <UserOpSubHeading hash={ hash }/>;

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

export default UserOp;
