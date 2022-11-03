import { Box, Alert } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import React from 'react';

import type { LogsResponse } from 'types/api/log';
import { QueryKeys } from 'types/client/queries';

import { SECOND } from 'lib/consts';
import useFetch from 'lib/hooks/useFetch';
import DataFetchAlert from 'ui/shared/DataFetchAlert';
import TxLogItem from 'ui/tx/logs/TxLogItem';
import TxLogSkeleton from 'ui/tx/logs/TxLogSkeleton';
import TxPendingAlert from 'ui/tx/TxPendingAlert';
import TxSocketAlert from 'ui/tx/TxSocketAlert';
import useFetchTxInfo from 'ui/tx/useFetchTxInfo';

const TxLogs = () => {
  const router = useRouter();
  const fetch = useFetch();

  const txInfo = useFetchTxInfo({ updateDelay: 5 * SECOND });
  const { data, isLoading, isError } = useQuery<unknown, unknown, LogsResponse>(
    [ QueryKeys.txLog, router.query.id ],
    async() => await fetch(`/node-api/transactions/${ router.query.id }/logs`),
    {
      enabled: Boolean(router.query.id) && Boolean(txInfo.data?.status),
    },
  );

  if (!txInfo.isLoading && !txInfo.isError && !txInfo.data.status) {
    return txInfo.socketStatus ? <TxSocketAlert status={ txInfo.socketStatus }/> : <TxPendingAlert/>;
  }

  if (isError || txInfo.isError) {
    return <DataFetchAlert/>;
  }

  if (isLoading || txInfo.isLoading) {
    return (
      <Box>
        <TxLogSkeleton/>
        <TxLogSkeleton/>
      </Box>
    );
  }

  if (data.items.length === 0) {
    return <Alert>There are no logs for this transaction.</Alert>;
  }

  return (
    <Box>
      { data.items.map((item, index) => <TxLogItem key={ index } { ...item }/>) }
    </Box>
  );
};

export default TxLogs;
