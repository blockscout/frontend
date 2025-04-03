import { Grid } from '@chakra-ui/react';
import type { UseQueryResult } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import React from 'react';

import type { OptimismL2TxnBatch } from 'types/api/optimisticL2';

import { route } from 'nextjs-routes';

import type { ResourceError } from 'lib/api/resources';
import throwOnResourceLoadError from 'lib/errors/throwOnResourceLoadError';
import { Link } from 'toolkit/chakra/link';
import { Skeleton } from 'toolkit/chakra/skeleton';
import isCustomAppError from 'ui/shared/AppError/isCustomAppError';
import OptimisticL2TxnBatchDA from 'ui/shared/batch/OptimisticL2TxnBatchDA';
import DataFetchAlert from 'ui/shared/DataFetchAlert';
import * as DetailedInfo from 'ui/shared/DetailedInfo/DetailedInfo';
import DetailedInfoTimestamp from 'ui/shared/DetailedInfo/DetailedInfoTimestamp';
import PrevNext from 'ui/shared/PrevNext';

import OptimisticL2TxnBatchBlobCallData from './OptimisticL2TxnBatchBlobCallData';
import OptimisticL2TxnBatchBlobCelestia from './OptimisticL2TxnBatchBlobCelestia';
import OptimisticL2TxnBatchBlobEip4844 from './OptimisticL2TxnBatchBlobEip4844';

interface Props {
  query: UseQueryResult<OptimismL2TxnBatch, ResourceError>;
}

const OptimisticL2TxnBatchDetails = ({ query }: Props) => {
  const router = useRouter();

  const { data, isError, error, isPlaceholderData } = query;

  const handlePrevNextClick = React.useCallback((direction: 'prev' | 'next') => {
    if (!data) {
      return;
    }

    const increment = direction === 'next' ? +1 : -1;
    const nextId = String(data.internal_id + increment);

    router.push({ pathname: '/batches/[number]', query: { number: nextId } }, undefined);
  }, [ data, router ]);

  if (isError) {
    if (isCustomAppError(error)) {
      throwOnResourceLoadError({ isError, error });
    }

    return <DataFetchAlert/>;
  }

  if (!data) {
    return null;
  }

  const blocksCount = data.l2_block_end - data.l2_block_start + 1;

  return (
    <Grid
      columnGap={ 8 }
      rowGap={{ base: 3, lg: 3 }}
      templateColumns={{ base: 'minmax(0, 1fr)', lg: 'minmax(min-content, 200px) minmax(0, 1fr)' }}
      overflow="hidden"
    >
      <DetailedInfo.ItemLabel
        isLoading={ isPlaceholderData }
        hint="Batch ID indicates the length of batches produced by grouping L2 blocks to be proven on L1"
      >
        Batch ID
      </DetailedInfo.ItemLabel>
      <DetailedInfo.ItemValue>
        <Skeleton loading={ isPlaceholderData }>
          { data.internal_id }
        </Skeleton>
        <PrevNext
          ml={ 6 }
          onClick={ handlePrevNextClick }
          prevLabel="View previous txn batch"
          nextLabel="View next txn batch"
          isPrevDisabled={ data.internal_id === 0 }
          isLoading={ isPlaceholderData }
        />
      </DetailedInfo.ItemValue>

      <DetailedInfo.ItemLabel
        isLoading={ isPlaceholderData }
        hint="Date and time at which batch is submitted to L1"
      >
        Timestamp
      </DetailedInfo.ItemLabel>
      <DetailedInfo.ItemValue>
        { data.l1_timestamp ?
          <DetailedInfoTimestamp timestamp={ data.l1_timestamp }isLoading={ isPlaceholderData }/> :
          'Undefined'
        }
      </DetailedInfo.ItemValue>

      <DetailedInfo.ItemLabel
        isLoading={ isPlaceholderData }
        hint="Number of transactions in this batch"
      >
        Transactions
      </DetailedInfo.ItemLabel>
      <DetailedInfo.ItemValue>
        <Skeleton loading={ isPlaceholderData }>
          <Link href={ route({ pathname: '/batches/[number]', query: { number: data.internal_id.toString(), tab: 'txs' } }) }>
            { data.transaction_count.toLocaleString() } transaction{ data.transaction_count === 1 ? '' : 's' }
          </Link>
          { ' ' }in this batch
        </Skeleton>
      </DetailedInfo.ItemValue>

      <DetailedInfo.ItemLabel
        isLoading={ isPlaceholderData }
        hint="Number of L2 blocks in this batch"
      >
        Blocks
      </DetailedInfo.ItemLabel>
      <DetailedInfo.ItemValue>
        <Skeleton loading={ isPlaceholderData }>
          <Link href={ route({ pathname: '/batches/[number]', query: { number: data.internal_id.toString(), tab: 'blocks' } }) }>
            { blocksCount.toLocaleString() } block{ blocksCount === 1 ? '' : 's' }
          </Link>
          { ' ' }in this batch
        </Skeleton>
      </DetailedInfo.ItemValue>

      <DetailedInfo.ItemLabel
        isLoading={ isPlaceholderData }
        hint="Where the batch data is stored"
      >
        Batch data container
      </DetailedInfo.ItemLabel>
      <DetailedInfo.ItemValue flexDir="column" alignItems="flex-start" rowGap={ 2 }>
        <OptimisticL2TxnBatchDA container={ data.batch_data_container } isLoading={ isPlaceholderData }/>
        { data.batch_data_container === 'in_blob4844' && data.blobs &&
          <OptimisticL2TxnBatchBlobEip4844 blobs={ data.blobs } isLoading={ isPlaceholderData }/> }
        { data.batch_data_container === 'in_calldata' && (
          <OptimisticL2TxnBatchBlobCallData
            l1TxHashes={ data.l1_transaction_hashes }
            l1Timestamp={ data.l1_timestamp }
            isLoading={ isPlaceholderData }
          />
        ) }
        { data.batch_data_container === 'in_celestia' && data.blobs &&
          <OptimisticL2TxnBatchBlobCelestia blobs={ data.blobs } isLoading={ isPlaceholderData }/> }
      </DetailedInfo.ItemValue>
    </Grid>
  );
};

export default OptimisticL2TxnBatchDetails;
