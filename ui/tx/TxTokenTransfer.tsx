import React from 'react';

import { QueryKeys } from 'types/client/queries';

import { SECOND } from 'lib/consts';
import DataFetchAlert from 'ui/shared/DataFetchAlert';
import TokenTransfer from 'ui/shared/TokenTransfer/TokenTransfer';
import TxPendingAlert from 'ui/tx/TxPendingAlert';
import TxSocketAlert from 'ui/tx/TxSocketAlert';
import useFetchTxInfo from 'ui/tx/useFetchTxInfo';

const TxTokenTransfer = () => {
  const { isError, isLoading, data, socketStatus } = useFetchTxInfo({ updateDelay: 5 * SECOND });

  if (!isLoading && !isError && !data.status) {
    return socketStatus ? <TxSocketAlert status={ socketStatus }/> : <TxPendingAlert/>;
  }

  if (isError) {
    return <DataFetchAlert/>;
  }

  const queryKey = [ QueryKeys.txTokenTransfers, data?.hash ];
  const path = `/node-api/transactions/${ data?.hash }/token-transfers`;

  return (
    <TokenTransfer
      isLoading={ isLoading }
      isDisabled={ !data?.status || !data?.hash }
      path={ path }
      queryKey={ queryKey }
      // todo_tom delete me
      baseAddress="0xd789a607CEac2f0E14867de4EB15b15C9FFB5859"/>
  );
};

export default TxTokenTransfer;
