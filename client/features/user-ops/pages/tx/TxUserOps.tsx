// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import TxPendingAlert from 'client/slices/tx/components/TxPendingAlert';
import TxSocketAlert from 'client/slices/tx/components/TxSocketAlert';
import type { TxQuery } from 'client/slices/tx/hooks/useTxQuery';

import UserOpsContent from 'client/features/user-ops/pages/index/UserOpsContent';
import { USER_OPS_ITEM } from 'client/features/user-ops/stubs';

import { generateListStub } from 'stubs/utils';
import DataFetchAlert from 'ui/shared/DataFetchAlert';
import useQueryWithPages from 'ui/shared/pagination/useQueryWithPages';

interface Props {
  txQuery: TxQuery;
}

const TxUserOps = ({ txQuery }: Props) => {
  const userOpsQuery = useQueryWithPages({
    resourceName: 'general:user_ops',
    options: {
      enabled: !txQuery.isPlaceholderData && Boolean(txQuery.data?.status && txQuery.data?.hash),
      // most often there is only one user op in one tx
      placeholderData: generateListStub<'general:user_ops'>(USER_OPS_ITEM, 1, { next_page_params: null }),
    },
    filters: { transaction_hash: txQuery.data?.hash },
  });

  if (!txQuery.isPending && !txQuery.isPlaceholderData && !txQuery.isError && !txQuery.data.status) {
    return txQuery.socketStatus ? <TxSocketAlert status={ txQuery.socketStatus }/> : <TxPendingAlert/>;
  }

  if (txQuery.isError) {
    return <DataFetchAlert/>;
  }

  return <UserOpsContent query={ userOpsQuery } showTx={ false }/>;
};

export default TxUserOps;
