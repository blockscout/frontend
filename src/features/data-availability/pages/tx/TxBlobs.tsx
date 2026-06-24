// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box } from '@chakra-ui/react';
import React from 'react';

import useApiQuery from 'src/api/hooks/useApiQuery';

import TxPendingAlert from 'src/slices/tx/components/TxPendingAlert';
import TxSocketAlert from 'src/slices/tx/components/TxSocketAlert';
import type { TxQuery } from 'src/slices/tx/hooks/useTxQuery';

import { TX_BLOB } from 'src/features/data-availability/stubs';

import DataList from 'src/shared/lists/DataList';

import TxBlobsList from './TxBlobsList';
import TxBlobsTable from './TxBlobsTable';

interface Props {
  txQuery: TxQuery;
}

const TxBlobs = ({ txQuery }: Props) => {
  const { data, isPlaceholderData, isError } = useApiQuery('core:tx_blobs', {
    pathParams: { hash: txQuery.data?.hash },
    queryOptions: {
      enabled: !txQuery.isPlaceholderData && Boolean(txQuery.data?.hash) && Boolean(txQuery.data?.status),
      placeholderData: { items: Array(3).fill(TX_BLOB) },
    },
  });

  if (!txQuery.isPending && !txQuery.isPlaceholderData && !txQuery.isError && !txQuery.data.status) {
    return txQuery.socketStatus ? <TxSocketAlert status={ txQuery.socketStatus }/> : <TxPendingAlert/>;
  }

  const content = data?.items ? (
    <>
      <Box hideBelow="lg">
        <TxBlobsTable data={ data.items } isLoading={ isPlaceholderData }/>
      </Box>
      <Box hideFrom="lg">
        <TxBlobsList data={ data.items } isLoading={ isPlaceholderData }/>
      </Box>
    </>
  ) : null;

  return (
    <DataList
      isError={ isError || txQuery.isError }
      itemsNum={ data?.items?.length }
      emptyText="There are no blobs for this transaction."
    >
      { content }
    </DataList>
  );
};

export default TxBlobs;
