// SPDX-License-Identifier: LicenseRef-Blockscout

import { inRange } from 'es-toolkit';
import { useRouter } from 'next/router';
import React from 'react';

import type { TransactionLog } from 'client/slices/log/types/api';
import type { TokenTransfer } from 'client/slices/token-transfer/types/api';
import type { TabItemRegular } from 'toolkit/components/AdaptiveTabs/types';

import useApiQuery from 'client/api/hooks/useApiQuery';

import TxTokenTransfer from 'client/slices/token-transfer/pages/tx/TxTokenTransfer';
import useTxQuery from 'client/slices/tx/hooks/useTxQuery';
import TxLogs from 'client/slices/tx/pages/details/logs/TxLogs';

import { USER_OP } from 'client/features/user-ops/stubs';

import throwOnAbsentParamError from 'client/shared/errors/throw-on-absent-param-error';
import throwOnResourceLoadError from 'client/shared/errors/throw-on-resource-load-error';
import getQueryParamString from 'client/shared/router/get-query-param-string';

import RoutedTabs from 'toolkit/components/RoutedTabs/RoutedTabs';
import TextAd from 'ui/shared/ad/TextAd';
import PageTitle from 'ui/shared/Page/PageTitle';

import UserOpDetails from './UserOpDetails';
import UserOpRaw from './UserOpRaw';
import UserOpSubHeading from './UserOpSubHeading';

const UserOp = () => {
  const router = useRouter();
  const hash = getQueryParamString(router.query.hash);

  const userOpQuery = useApiQuery('general:user_op', {
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
      if (!userOpQuery.data.user_logs_start_index || !userOpQuery.data.user_logs_count) {
        return false;
      }
      if (inRange(
        Number(tt.log_index),
        userOpQuery.data?.user_logs_start_index,
        userOpQuery.data?.user_logs_start_index + userOpQuery.data?.user_logs_count,
      )) {
        return true;
      }
      return false;
    }
  }, [ userOpQuery.data ]);

  const filterLogsByLogIndex = React.useCallback((log: TransactionLog) => {
    if (!userOpQuery.data) {
      return true;
    } else {
      if (!userOpQuery.data.user_logs_start_index || !userOpQuery.data.user_logs_count) {
        return false;
      }
      if (inRange(log.index, userOpQuery.data?.user_logs_start_index, userOpQuery.data?.user_logs_start_index + userOpQuery.data?.user_logs_count)) {
        return true;
      }
      return false;
    }
  }, [ userOpQuery.data ]);

  const tabs: Array<TabItemRegular> = React.useMemo(() => ([
    { id: 'index', title: 'Details', component: <UserOpDetails query={ userOpQuery }/> },
    {
      id: 'token_transfers',
      title: 'Token transfers',
      component: <TxTokenTransfer txQuery={ txQuery } tokenTransferFilter={ filterTokenTransfersByLogIndex }/>,
    },
    { id: 'logs', title: 'Logs', component: <TxLogs txQuery={ txQuery } logsFilter={ filterLogsByLogIndex }/> },
    { id: 'raw', title: 'Raw', component: <UserOpRaw rawData={ userOpQuery.data?.raw } isLoading={ userOpQuery.isPlaceholderData }/> },
  ]), [ userOpQuery, txQuery, filterTokenTransfersByLogIndex, filterLogsByLogIndex ]);

  throwOnAbsentParamError(hash);
  throwOnResourceLoadError(userOpQuery);

  const titleSecondRow = <UserOpSubHeading hash={ hash }/>;

  return (
    <>
      <TextAd mb={ 6 }/>
      <PageTitle
        title="User operation details"
        secondRow={ titleSecondRow }
      />
      <RoutedTabs tabs={ tabs } isLoading={ userOpQuery.isPlaceholderData }/>
    </>
  );
};

export default UserOp;
