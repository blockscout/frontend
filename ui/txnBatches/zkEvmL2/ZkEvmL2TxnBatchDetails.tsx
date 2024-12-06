import { Grid, Text, Skeleton } from '@chakra-ui/react';
import type { UseQueryResult } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import React from 'react';

import { ZKEVM_L2_TX_BATCH_STATUSES } from 'types/api/zkEvmL2';
import type { ZkEvmL2TxnBatch } from 'types/api/zkEvmL2';

import { route } from 'nextjs-routes';

import type { ResourceError } from 'lib/api/resources';
import throwOnResourceLoadError from 'lib/errors/throwOnResourceLoadError';
import isCustomAppError from 'ui/shared/AppError/isCustomAppError';
import CopyToClipboard from 'ui/shared/CopyToClipboard';
import DataFetchAlert from 'ui/shared/DataFetchAlert';
import * as DetailsInfoItem from 'ui/shared/DetailsInfoItem';
import DetailsInfoItemDivider from 'ui/shared/DetailsInfoItemDivider';
import DetailsTimestamp from 'ui/shared/DetailsTimestamp';
import TxEntityL1 from 'ui/shared/entities/tx/TxEntityL1';
import HashStringShortenDynamic from 'ui/shared/HashStringShortenDynamic';
import LinkInternal from 'ui/shared/links/LinkInternal';
import PrevNext from 'ui/shared/PrevNext';
import VerificationSteps from 'ui/shared/verificationSteps/VerificationSteps';

interface Props {
  query: UseQueryResult<ZkEvmL2TxnBatch, ResourceError>;
}

const ZkEvmL2TxnBatchDetails = ({ query }: Props) => {
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
      <DetailsInfoItem.Label
        isLoading={ isPlaceholderData }
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
      >
        Status
      </DetailsInfoItem.Label>
      <DetailsInfoItem.Value>
        <VerificationSteps steps={ ZKEVM_L2_TX_BATCH_STATUSES } currentStep={ data.status } isLoading={ isPlaceholderData }/>
      </DetailsInfoItem.Value>

      <DetailsInfoItem.Label
        isLoading={ isPlaceholderData }
      >
        Timestamp
      </DetailsInfoItem.Label>
      <DetailsInfoItem.Value>
        { data.timestamp ? <DetailsTimestamp timestamp={ data.timestamp } isLoading={ isPlaceholderData }/> : 'Undefined' }
      </DetailsInfoItem.Value>

      <DetailsInfoItem.Label
        isLoading={ isPlaceholderData }
      >
        Verify tx hash
      </DetailsInfoItem.Label>
      <DetailsInfoItem.Value>
        { data.verify_transaction_hash ? (
          <TxEntityL1
            isLoading={ isPlaceholderData }
            hash={ data.verify_transaction_hash }
            maxW="100%"
          />
        ) : <Text>Pending</Text> }
      </DetailsInfoItem.Value>

      <DetailsInfoItem.Label
        isLoading={ isPlaceholderData }
      >
        Transactions
      </DetailsInfoItem.Label>
      <DetailsInfoItem.Value>
        <Skeleton isLoaded={ !isPlaceholderData }>
          <LinkInternal href={ route({ pathname: '/batches/[number]', query: { number: data.number.toString(), tab: 'txs' } }) }>
            { data.transactions.length } transaction{ data.transactions.length === 1 ? '' : 's' }
          </LinkInternal>
        </Skeleton>
      </DetailsInfoItem.Value>

      <DetailsInfoItemDivider/>

      <DetailsInfoItem.Label
        isLoading={ isPlaceholderData }
      >
        Global exit root
      </DetailsInfoItem.Label>
      <DetailsInfoItem.Value
        flexWrap="nowrap"
      >
        <Skeleton isLoaded={ !isPlaceholderData } overflow="hidden">
          <HashStringShortenDynamic hash={ data.global_exit_root }/>
        </Skeleton>
        <CopyToClipboard text={ data.global_exit_root } isLoading={ isPlaceholderData }/>
      </DetailsInfoItem.Value>

      <DetailsInfoItem.Label
        isLoading={ isPlaceholderData }
      >
        Acc input hash
      </DetailsInfoItem.Label>
      <DetailsInfoItem.Value
        flexWrap="nowrap"
      >
        <Skeleton isLoaded={ !isPlaceholderData } overflow="hidden">
          <HashStringShortenDynamic hash={ data.acc_input_hash }/>
        </Skeleton>
        <CopyToClipboard text={ data.acc_input_hash } isLoading={ isPlaceholderData }/>
      </DetailsInfoItem.Value>

      <DetailsInfoItem.Label
        isLoading={ isPlaceholderData }
      >
        Sequence tx hash
      </DetailsInfoItem.Label>
      <DetailsInfoItem.Value>
        { data.sequence_transaction_hash ? (
          <TxEntityL1
            isLoading={ isPlaceholderData }
            hash={ data.sequence_transaction_hash }
            maxW="100%"
          />
        ) : <Text>Pending</Text> }
      </DetailsInfoItem.Value>

      <DetailsInfoItem.Label
        isLoading={ isPlaceholderData }
      >
        State root
      </DetailsInfoItem.Label>
      <DetailsInfoItem.Value
        flexWrap="nowrap"
      >
        <Skeleton isLoaded={ !isPlaceholderData } overflow="hidden">
          <HashStringShortenDynamic hash={ data.state_root }/>
        </Skeleton>
        <CopyToClipboard text={ data.state_root } isLoading={ isPlaceholderData }/>
      </DetailsInfoItem.Value>
    </Grid>
  );
};

export default ZkEvmL2TxnBatchDetails;
