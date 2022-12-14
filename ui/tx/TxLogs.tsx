import { Box, Text } from '@chakra-ui/react';
import React from 'react';

import { QueryKeys } from 'types/client/queries';

import { SECOND } from 'lib/consts';
import useQueryWithPages from 'lib/hooks/useQueryWithPages';
import ActionBar from 'ui/shared/ActionBar';
import DataFetchAlert from 'ui/shared/DataFetchAlert';
import Pagination from 'ui/shared/Pagination';
import TxLogItem from 'ui/tx/logs/TxLogItem';
import TxLogSkeleton from 'ui/tx/logs/TxLogSkeleton';
import TxPendingAlert from 'ui/tx/TxPendingAlert';
import TxSocketAlert from 'ui/tx/TxSocketAlert';
import useFetchTxInfo from 'ui/tx/useFetchTxInfo';

const TxLogs = () => {
  const txInfo = useFetchTxInfo({ updateDelay: 5 * SECOND });
  const { data, isLoading, isError, pagination } = useQueryWithPages({
    apiPath: `/node-api/transactions/${ txInfo.data?.hash }/logs`,
    queryName: QueryKeys.txLogs,
    queryIds: txInfo.data?.hash ? [ txInfo.data.hash ] : undefined,
    options: {
      enabled: Boolean(txInfo.data?.hash) && Boolean(txInfo.data?.status),
    },
  });
  const isPaginatorHidden = !isLoading && !isError && pagination.page === 1 && !pagination.hasNextPage;

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
    return <Text as="span">There are no logs for this transaction.</Text>;
  }

  return (
    <Box>
      { !isPaginatorHidden && (
        <ActionBar mt={ -6 }>
          <Pagination ml="auto" { ...pagination }/>
        </ActionBar>
      ) }
      { data.items.map((item, index) => <TxLogItem key={ index } { ...item }/>) }
    </Box>
  );
};

export default TxLogs;
