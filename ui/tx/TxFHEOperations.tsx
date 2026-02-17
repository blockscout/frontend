import { Box } from '@chakra-ui/react';
import React from 'react';

import useApiQuery from 'lib/api/useApiQuery';
import { FHE_OPERATIONS_RESPONSE } from 'stubs/fheOperations';
import DataFetchAlert from 'ui/shared/DataFetchAlert';
import DataListDisplay from 'ui/shared/DataListDisplay';
import TxFHEOperationsList from 'ui/tx/fheOperations/TxFHEOperationsList';
import TxFHEOperationsStats from 'ui/tx/fheOperations/TxFHEOperationsStats';
import TxFHEOperationsTable from 'ui/tx/fheOperations/TxFHEOperationsTable';
import TxPendingAlert from 'ui/tx/TxPendingAlert';
import TxSocketAlert from 'ui/tx/TxSocketAlert';

import type { TxQuery } from './useTxQuery';

interface Props {
  txQuery: TxQuery;
}

const TxFHEOperations = ({ txQuery }: Props) => {
  const hash = txQuery.data?.hash || '';
  const isEnabled = Boolean(hash) && Boolean(txQuery.data?.status) && !txQuery.isPlaceholderData;

  const { data, isLoading, isError, isPlaceholderData } = useApiQuery('general:tx_fhe_operations', {
    pathParams: { hash },
    queryOptions: {
      enabled: isEnabled,
      retry: false,
      placeholderData: FHE_OPERATIONS_RESPONSE,
    },
  });

  if (!txQuery.isPending && !txQuery.isPlaceholderData && !txQuery.isError && txQuery.data && !txQuery.data.status) {
    return txQuery.socketStatus ? <TxSocketAlert status={ txQuery.socketStatus }/> : <TxPendingAlert/>;
  }

  if (txQuery.isError) {
    return <DataFetchAlert/>;
  }

  const isLoadingState = isLoading || txQuery.isPlaceholderData || !hash;
  const displayData = data || (isLoadingState ? FHE_OPERATIONS_RESPONSE : null);
  const showLoadingSkeletons = isLoadingState || isPlaceholderData;

  if (isError) {
    return <DataFetchAlert/>;
  }

  const content = displayData ? (
    <>
      <TxFHEOperationsStats
        totalHcu={ displayData.total_hcu }
        maxDepthHcu={ displayData.max_depth_hcu }
        operationCount={ displayData.operation_count }
        itemsCount={ displayData.items.length }
        isLoading={ showLoadingSkeletons }
      />
      <Box>
        <TxFHEOperationsTable data={ displayData.items } isLoading={ showLoadingSkeletons }/>
        <TxFHEOperationsList data={ displayData.items } isLoading={ showLoadingSkeletons }/>
      </Box>
    </>
  ) : null;

  return (
    <DataListDisplay
      isError={ isError }
      itemsNum={ displayData?.items?.length ?? 0 }
      emptyText="There are no FHE Operations for this transaction."
    >
      { content }
    </DataListDisplay>
  );
};

export default React.memo(TxFHEOperations);
