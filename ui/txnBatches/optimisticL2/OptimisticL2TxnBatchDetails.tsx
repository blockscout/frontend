import { Grid, Skeleton } from '@chakra-ui/react';
import type { UseQueryResult } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import React from 'react';

import type { OptimismL2TxnBatch } from 'types/api/optimisticL2';

import { route } from 'nextjs-routes';

import type { ResourceError } from 'lib/api/resources';
import throwOnResourceLoadError from 'lib/errors/throwOnResourceLoadError';
import isCustomAppError from 'ui/shared/AppError/isCustomAppError';
import OptimisticL2TxnBatchDA from 'ui/shared/batch/OptimisticL2TxnBatchDA';
import DataFetchAlert from 'ui/shared/DataFetchAlert';
import * as DetailsInfoItem from 'ui/shared/DetailsInfoItem';
import DetailsTimestamp from 'ui/shared/DetailsTimestamp';
import LinkInternal from 'ui/shared/links/LinkInternal';
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
      <DetailsInfoItem.Label
        isLoading={ isPlaceholderData }
        hint="Batch ID indicates the length of batches produced by grouping L2 blocks to be proven on L1"
      >
        Batch ID
      </DetailsInfoItem.Label>
      <DetailsInfoItem.Value>
        <Skeleton isLoaded={ !isPlaceholderData }>
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
      </DetailsInfoItem.Value>

      <DetailsInfoItem.Label
        isLoading={ isPlaceholderData }
        hint="Date and time at which batch is submitted to L1"
      >
        Timestamp
      </DetailsInfoItem.Label>
      <DetailsInfoItem.Value>
        { data.l1_timestamp ?
          <DetailsTimestamp timestamp={ data.l1_timestamp }isLoading={ isPlaceholderData }/> :
          'Undefined'
        }
      </DetailsInfoItem.Value>

      <DetailsInfoItem.Label
        isLoading={ isPlaceholderData }
        hint="Number of transactions in this batch"
      >
        Transactions
      </DetailsInfoItem.Label>
      <DetailsInfoItem.Value>
        <Skeleton isLoaded={ !isPlaceholderData }>
          <LinkInternal href={ route({ pathname: '/batches/[number]', query: { number: data.internal_id.toString(), tab: 'txs' } }) }>
            { data.transaction_count.toLocaleString() } transaction{ data.transaction_count === 1 ? '' : 's' }
          </LinkInternal>
          { ' ' }in this batch
        </Skeleton>
      </DetailsInfoItem.Value>

      <DetailsInfoItem.Label
        isLoading={ isPlaceholderData }
        hint="Number of L2 blocks in this batch"
      >
        Blocks
      </DetailsInfoItem.Label>
      <DetailsInfoItem.Value>
        <Skeleton isLoaded={ !isPlaceholderData }>
          <LinkInternal href={ route({ pathname: '/batches/[number]', query: { number: data.internal_id.toString(), tab: 'blocks' } }) }>
            { blocksCount.toLocaleString() } block{ blocksCount === 1 ? '' : 's' }
          </LinkInternal>
          { ' ' }in this batch
        </Skeleton>
      </DetailsInfoItem.Value>

      <DetailsInfoItem.Label
        isLoading={ isPlaceholderData }
        hint="Where the batch data is stored"
      >
        Batch data container
      </DetailsInfoItem.Label>
      <DetailsInfoItem.Value flexDir="column" alignItems="flex-start" rowGap={ 2 }>
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
      </DetailsInfoItem.Value>
    </Grid>
  );
};

export default OptimisticL2TxnBatchDetails;
