import { Grid, Text, Skeleton, Flex } from '@chakra-ui/react';
import type { UseQueryResult } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import React from 'react';

import { ZKSYNC_L2_TX_BATCH_STATUSES, type ZkSyncBatch } from 'types/api/zkSyncL2';

import { route } from 'nextjs-routes';

import type { ResourceError } from 'lib/api/resources';
import throwOnResourceLoadError from 'lib/errors/throwOnResourceLoadError';
import isCustomAppError from 'ui/shared/AppError/isCustomAppError';
import DataFetchAlert from 'ui/shared/DataFetchAlert';
import DetailsInfoItem from 'ui/shared/DetailsInfoItem';
import DetailsInfoItemDivider from 'ui/shared/DetailsInfoItemDivider';
import DetailsTimestamp from 'ui/shared/DetailsTimestamp';
import TxEntityL1 from 'ui/shared/entities/tx/TxEntityL1';
import LinkInternal from 'ui/shared/LinkInternal';
import PrevNext from 'ui/shared/PrevNext';
import VerificationSteps from 'ui/shared/verificationSteps/VerificationSteps';

interface Props {
  query: UseQueryResult<ZkSyncBatch, ResourceError>;
}

const ZkSyncL2TxnBatchDetails = ({ query }: Props) => {
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

  return (
    <Grid
      columnGap={ 8 }
      rowGap={{ base: 3, lg: 3 }}
      templateColumns={{ base: 'minmax(0, 1fr)', lg: 'minmax(min-content, 200px) minmax(0, 1fr)' }}
      overflow="hidden"
    >
      <DetailsInfoItem
        title="Tx batch number"
        hint="Batch number indicates the length of Batches produced by grouping L2 blocks to be proven on Ethereum."
        isLoading={ isPlaceholderData }
      >
        <Skeleton isLoaded={ !isPlaceholderData }>
          { data.number }
        </Skeleton>
        <PrevNext
          ml={ 6 }
          onClick={ handlePrevNextClick }
          prevLabel="View previous tx batch"
          nextLabel="View next tx batch"
          isPrevDisabled={ data.number === 0 }
          isLoading={ isPlaceholderData }
        />
      </DetailsInfoItem>

      <DetailsInfoItem
        title="Status"
        hint="Status is the short interpretation of the Batch lifecycle"
        isLoading={ isPlaceholderData }
      >
        <VerificationSteps steps={ ZKSYNC_L2_TX_BATCH_STATUSES } currentStep={ data.status } isLoading={ isPlaceholderData }/>
      </DetailsInfoItem>

      <DetailsInfoItem
        title="Timestamp"
        hint="Date and time at which batch is produced"
        isLoading={ isPlaceholderData }
      >
        { data.timestamp ? <DetailsTimestamp timestamp={ data.timestamp } isLoading={ isPlaceholderData }/> : 'Undefined' }
      </DetailsInfoItem>

      <DetailsInfoItem
        title="Transactions"
        hint="Number of transactions inside the batch."
        isLoading={ isPlaceholderData }
      >
        <Skeleton isLoaded={ !isPlaceholderData }>
          <LinkInternal href={ route({ pathname: '/batches/[number]', query: { number: data.number.toString(), tab: 'txs' } }) }>
            { data.l2_tx_count } transaction{ data.l2_tx_count === 1 ? '' : 's' }
          </LinkInternal>
        </Skeleton>
      </DetailsInfoItem>

      <DetailsInfoItemDivider/>

      <DetailsInfoItem
        title="Commit tx hash"
        hint="Hash of L1 tx on which this Batch was committed"
        isLoading={ isPlaceholderData }
      >
        { data.commit_transaction_hash ? (
          <>
            <TxEntityL1
              isLoading={ isPlaceholderData }
              hash={ data.commit_transaction_hash }
              maxW="100%"
              noCopy={ false }
            />
            { data.commit_transaction_timestamp && (
              <Flex alignItems="center" flexWrap="wrap" rowGap={ 3 }>
                <DetailsTimestamp timestamp={ data.commit_transaction_timestamp } isLoading={ isPlaceholderData }/>
              </Flex>
            ) }
          </>
        ) : <Text>Pending</Text> }
      </DetailsInfoItem>

      <DetailsInfoItem
        title="Commit tx hash"
        hint="Hash of L1 tx on which this Batch was proven"
        isLoading={ isPlaceholderData }
      >
        { data.prove_transaction_hash ? (
          <>
            <TxEntityL1
              isLoading={ isPlaceholderData }
              hash={ data.prove_transaction_hash }
              maxW="100%"
              noCopy={ false }
            />
            { data.prove_transaction_timestamp && (
              <Flex alignItems="center" flexWrap="wrap" rowGap={ 3 }>
                <DetailsTimestamp timestamp={ data.prove_transaction_timestamp } isLoading={ isPlaceholderData }/>
              </Flex>
            ) }
          </>
        ) : <Text>Pending</Text> }
      </DetailsInfoItem>

      <DetailsInfoItem
        title="Execute tx hash"
        hint="Hash of L1 tx on which this Batch was executed and finalized"
        isLoading={ isPlaceholderData }
      >
        { data.execute_transaction_hash ? (
          <>
            <TxEntityL1
              isLoading={ isPlaceholderData }
              hash={ data.execute_transaction_hash }
              maxW="100%"

            />
            { data.execute_transaction_timestamp && (
              <Flex alignItems="center" flexWrap="wrap" rowGap={ 3 }>
                <DetailsTimestamp timestamp={ data.execute_transaction_timestamp } isLoading={ isPlaceholderData }/>
              </Flex>
            ) }
          </>
        ) : <Text>Pending</Text> }
      </DetailsInfoItem>
    </Grid>
  );
};

export default ZkSyncL2TxnBatchDetails;
