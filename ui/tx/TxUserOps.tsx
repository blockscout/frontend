import React from 'react';

import { SECOND } from 'lib/consts';
import { USER_OPS_ITEM } from 'stubs/userOps';
import { generateListStub } from 'stubs/utils';
import useQueryWithPages from 'ui/shared/pagination/useQueryWithPages';
import TxPendingAlert from 'ui/tx/TxPendingAlert';
import TxSocketAlert from 'ui/tx/TxSocketAlert';
import useFetchTxInfo from 'ui/tx/useFetchTxInfo';
import UserOpsContent from 'ui/userOps/UserOpsContent';

const TxUserOps = () => {
  const txsInfo = useFetchTxInfo({ updateDelay: 5 * SECOND });

  const userOpsQuery = useQueryWithPages({
    resourceName: 'user_ops',
    options: {
      enabled: !txsInfo.isPlaceholderData && Boolean(txsInfo.data?.status && txsInfo.data?.hash),
      // most often there is only one user op in one tx
      placeholderData: generateListStub<'user_ops'>(USER_OPS_ITEM, 1, { next_page_params: null }),
    },
    filters: { transaction_hash: txsInfo.data?.hash },
  });

  if (!txsInfo.isPending && !txsInfo.isPlaceholderData && !txsInfo.isError && !txsInfo.data.status) {
    return txsInfo.socketStatus ? <TxSocketAlert status={ txsInfo.socketStatus }/> : <TxPendingAlert/>;
  }

  return <UserOpsContent query={ userOpsQuery } showTx={ false }/>;
};

export default TxUserOps;
