// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box } from '@chakra-ui/react';
import React from 'react';

import useApiQuery from 'src/api/hooks/useApiQuery';

import TxPendingAlert from 'src/slices/tx/components/TxPendingAlert';
import TxSocketAlert from 'src/slices/tx/components/TxSocketAlert';
import type { TxQuery } from 'src/slices/tx/hooks/useTxQuery';

import ApiFetchAlert from 'src/shared/alerts/ApiFetchAlert';
import DataList from 'src/shared/lists/DataList';

import { FHE_OPERATIONS_RESPONSE } from '../../stubs';
import TxFHEOperationsList from './TxFheOperationsList';
import TxFHEOperationsStats from './TxFheOperationsStats';
import TxFHEOperationsTable from './TxFheOperationsTable';

interface Props {
  txQuery: TxQuery;
}

const TxFHEOperations = ({ txQuery }: Props) => {
  const hash = txQuery.data?.hash || '';
  const isEnabled = Boolean(hash) && Boolean(txQuery.data?.status) && !txQuery.isPlaceholderData;

  const { data, isError, isPlaceholderData } = useApiQuery('general:tx_fhe_operations', {
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

  if (txQuery.isError || isError) {
    return <ApiFetchAlert/>;
  }

  const content = data ? (
    <>
      <TxFHEOperationsStats
        totalHcu={ data.total_hcu }
        maxDepthHcu={ data.max_depth_hcu }
        operationCount={ data.operation_count }
        isLoading={ isPlaceholderData }
      />
      <Box>
        <TxFHEOperationsTable data={ data.items } isLoading={ isPlaceholderData }/>
        <TxFHEOperationsList data={ data.items } isLoading={ isPlaceholderData }/>
      </Box>
    </>
  ) : null;

  return (
    <DataList
      isError={ isError }
      itemsNum={ data?.items?.length ?? 0 }
      emptyText="There are no FHE operations for this transaction."
    >
      { content }
    </DataList>
  );
};

export default React.memo(TxFHEOperations);
