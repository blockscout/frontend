import { Box, Alert } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import React from 'react';

import type { LogsResponse } from 'types/api/log';

import useFetch from 'lib/hooks/useFetch';
import DataFetchAlert from 'ui/shared/DataFetchAlert';
import TxLogItem from 'ui/tx/logs/TxLogItem';
import TxLogSkeleton from 'ui/tx/logs/TxLogSkeleton';

const TxLogs = () => {
  const router = useRouter();
  const fetch = useFetch();

  const { data, isLoading, isError } = useQuery<unknown, unknown, LogsResponse>(
    [ 'tx-log', router.query.id ],
    async() => await fetch(`/api/transactions/${ router.query.id }/logs`),
    {
      enabled: Boolean(router.query.id),
    },
  );

  if (isError) {
    return <DataFetchAlert/>;
  }

  if (isLoading) {
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
