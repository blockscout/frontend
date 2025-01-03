import { Grid } from '@chakra-ui/react';
import type { UseQueryResult } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import React from 'react';

import type { ScrollL2TxnBatch } from 'types/api/scrollL2';

import { route } from 'nextjs-routes';

import type { ResourceError } from 'lib/api/resources';
import throwOnResourceLoadError from 'lib/errors/throwOnResourceLoadError';
import isCustomAppError from 'ui/shared/AppError/isCustomAppError';
import ScrollL2TxnBatchDA from 'ui/shared/batch/ScrollL2TxnBatchDA';
import Skeleton from 'ui/shared/chakra/Skeleton';
import DataFetchAlert from 'ui/shared/DataFetchAlert';
import * as DetailsInfoItem from 'ui/shared/DetailsInfoItem';
import DetailsTimestamp from 'ui/shared/DetailsTimestamp';
import BlockEntityL1 from 'ui/shared/entities/block/BlockEntityL1';
import TxEntityL1 from 'ui/shared/entities/tx/TxEntityL1';
import LinkInternal from 'ui/shared/links/LinkInternal';
import PrevNext from 'ui/shared/PrevNext';
import ScrollL2TxnBatchStatus from 'ui/shared/statusTag/ScrollL2TxnBatchStatus';

interface Props {
  query: UseQueryResult<ScrollL2TxnBatch, ResourceError>;
}

const ScrollL2TxnBatchDetails = ({ query }: Props) => {
  const router = useRouter();

  const { data, isPlaceholderData, isError, error } = query;

  const handlePrevNextClick = React.useCallback((direction: 'prev' | 'next') => {
    if (!data) {
      return;
    }

    const increment = direction === 'next' ? +1 : -1;
    const nextId = String(data.number + increment);

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

  const blocksCount = data.end_block - data.start_block + 1;

  return (
    <Grid
      columnGap={ 8 }
      rowGap={{ base: 3, lg: 3 }}
      templateColumns={{ base: 'minmax(0, 1fr)', lg: 'minmax(min-content, 200px) minmax(0, 1fr)' }}
      overflow="hidden"
    >
      <DetailsInfoItem.Label
        isLoading={ isPlaceholderData }
        hint="Batch number indicates the length of batches produced by grouping L2 blocks to be proven on L1"
      >
        Txn batch number
      </DetailsInfoItem.Label>
      <DetailsInfoItem.Value>
        <Skeleton isLoaded={ !isPlaceholderData }>
          { data.number }
        </Skeleton>
        <PrevNext
          ml={ 6 }
          onClick={ handlePrevNextClick }
          prevLabel="View previous txn batch"
          nextLabel="View next txn batch"
          isPrevDisabled={ data.number === 0 }
          isLoading={ isPlaceholderData }
        />
      </DetailsInfoItem.Value>

      <DetailsInfoItem.Label
        isLoading={ isPlaceholderData }
        hint="Data availability container"
      >
        Container
      </DetailsInfoItem.Label>
      <DetailsInfoItem.Value>
        <ScrollL2TxnBatchDA container={ data.data_availability.batch_data_container } isLoading={ isPlaceholderData }/>
      </DetailsInfoItem.Value>

      <DetailsInfoItem.Label
        isLoading={ isPlaceholderData }
        hint="Status of this batch"
      >
        Status
      </DetailsInfoItem.Label>
      <DetailsInfoItem.Value>
        <ScrollL2TxnBatchStatus status={ data.confirmation_transaction.hash ? 'Finalized' : 'Committed' } isLoading={ isPlaceholderData }/>
      </DetailsInfoItem.Value>

      <DetailsInfoItem.Label
        isLoading={ isPlaceholderData }
        hint="Date and time at which batch is finalized to L1"
      >
        Finalized timestamp
      </DetailsInfoItem.Label>
      <DetailsInfoItem.Value>
        { data.confirmation_transaction.timestamp ?
          <DetailsTimestamp timestamp={ data.confirmation_transaction.timestamp }isLoading={ isPlaceholderData }/> :
          <Skeleton isLoaded={ !isPlaceholderData } display="inline-block">Pending</Skeleton>
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
          <LinkInternal href={ route({ pathname: '/batches/[number]', query: { number: data.number.toString(), tab: 'txs' } }) }>
            { data.transaction_count.toLocaleString() } transaction{ data.transaction_count === 1 ? '' : 's' }
          </LinkInternal>
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
          <LinkInternal href={ route({ pathname: '/batches/[number]', query: { number: data.number.toString(), tab: 'blocks' } }) }>
            { blocksCount.toLocaleString() } block{ blocksCount === 1 ? '' : 's' }
          </LinkInternal>
        </Skeleton>
      </DetailsInfoItem.Value>

      <DetailsInfoItem.Label
        isLoading={ isPlaceholderData }
        hint="Date and time at which batch is committed to L1"
      >
        Committed timestamp
      </DetailsInfoItem.Label>
      <DetailsInfoItem.Value>
        { data.commitment_transaction.timestamp ?
          <DetailsTimestamp timestamp={ data.commitment_transaction.timestamp }isLoading={ isPlaceholderData }/> :
          <Skeleton isLoaded={ !isPlaceholderData } display="inline-block">Pending</Skeleton>
        }
      </DetailsInfoItem.Value>

      <DetailsInfoItem.Label
        isLoading={ isPlaceholderData }
        hint="Hash of L1 transaction this batch was committed in"
      >
        Committed transaction hash
      </DetailsInfoItem.Label>
      <DetailsInfoItem.Value>
        <TxEntityL1
          isLoading={ isPlaceholderData }
          hash={ data.commitment_transaction.hash }
          maxW="100%"
        />
      </DetailsInfoItem.Value>

      <DetailsInfoItem.Label
        isLoading={ isPlaceholderData }
        hint="L1 block that includes transaction with this batch commitment"
      >
        Committed block
      </DetailsInfoItem.Label>
      <DetailsInfoItem.Value>
        <BlockEntityL1
          isLoading={ isPlaceholderData }
          number={ data.commitment_transaction.block_number }
        />
      </DetailsInfoItem.Value>

      <DetailsInfoItem.Label
        isLoading={ isPlaceholderData }
        hint="Hash of L1 transaction this batch was finalized in"
      >
        Finalized transaction hash
      </DetailsInfoItem.Label>
      <DetailsInfoItem.Value>
        { data.confirmation_transaction.hash ? (
          <TxEntityL1
            isLoading={ isPlaceholderData }
            hash={ data.confirmation_transaction.hash }
            maxW="100%"
          />
        ) : <Skeleton isLoaded={ !isPlaceholderData } display="inline-block">Pending</Skeleton> }
      </DetailsInfoItem.Value>

      <DetailsInfoItem.Label
        isLoading={ isPlaceholderData }
        hint="L1 block that includes transaction with this batch finalization data"
      >
        Finalized block
      </DetailsInfoItem.Label>
      <DetailsInfoItem.Value>
        { data.confirmation_transaction.block_number ? (
          <BlockEntityL1
            isLoading={ isPlaceholderData }
            number={ data.confirmation_transaction.block_number }
          />
        ) : <Skeleton isLoaded={ !isPlaceholderData } display="inline-block">Pending</Skeleton> }
      </DetailsInfoItem.Value>
    </Grid>
  );
};

export default ScrollL2TxnBatchDetails;
