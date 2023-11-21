import { Grid, Text, Skeleton } from '@chakra-ui/react';
import type { UseQueryResult } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import React from 'react';

import { ZKEVM_L2_TX_BATCH_STATUSES } from 'types/api/zkEvmL2TxnBatches';
import type { ZkEvmL2TxnBatch } from 'types/api/zkEvmL2TxnBatches';

import { route } from 'nextjs-routes';

import clockIcon from 'icons/clock.svg';
import type { ResourceError } from 'lib/api/resources';
import dayjs from 'lib/date/dayjs';
import Icon from 'ui/shared/chakra/Icon';
import CopyToClipboard from 'ui/shared/CopyToClipboard';
import DataFetchAlert from 'ui/shared/DataFetchAlert';
import DetailsInfoItem from 'ui/shared/DetailsInfoItem';
import DetailsInfoItemDivider from 'ui/shared/DetailsInfoItemDivider';
import TxEntityL1 from 'ui/shared/entities/tx/TxEntityL1';
import HashStringShortenDynamic from 'ui/shared/HashStringShortenDynamic';
import LinkInternal from 'ui/shared/LinkInternal';
import PrevNext from 'ui/shared/PrevNext';
import TextSeparator from 'ui/shared/TextSeparator';
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

    router.push({ pathname: '/zkevm-l2-txn-batch/[number]', query: { number: nextId } }, undefined);
  }, [ data, router ]);

  if (isError) {
    if (error?.status === 404) {
      throw Error('Tx Batch not found', { cause: error as unknown as Error });
    }

    if (error?.status === 422) {
      throw Error('Invalid tx batch number', { cause: error as unknown as Error });
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
        isLoading={ isPlaceholderData }
      >
        <VerificationSteps steps={ ZKEVM_L2_TX_BATCH_STATUSES } currentStep={ data.status } isLoading={ isPlaceholderData }/>
      </DetailsInfoItem>
      <DetailsInfoItem
        title="Timestamp"
        isLoading={ isPlaceholderData }
      >
        <Icon as={ clockIcon } boxSize={ 5 } color="gray.500" isLoading={ isPlaceholderData }/>
        <Skeleton isLoaded={ !isPlaceholderData } ml={ 1 }>
          { dayjs(data.timestamp).fromNow() }
        </Skeleton>
        <TextSeparator/>
        <Skeleton isLoaded={ !isPlaceholderData } whiteSpace="normal">
          { dayjs(data.timestamp).format('llll') }
        </Skeleton>
      </DetailsInfoItem>
      <DetailsInfoItem
        title="Verify tx hash"
        isLoading={ isPlaceholderData }
      >
        { data.verify_tx_hash ? (
          <TxEntityL1
            isLoading={ isPlaceholderData }
            hash={ data.verify_tx_hash }
            maxW="100%"
          />
        ) : <Text>pending</Text> }
      </DetailsInfoItem>
      <DetailsInfoItem
        title="Transactions"
        isLoading={ isPlaceholderData }
      >
        <Skeleton isLoaded={ !isPlaceholderData }>
          <LinkInternal href={ route({ pathname: '/zkevm-l2-txn-batch/[number]', query: { number: data.number.toString(), tab: 'txs' } }) }>
            { data.transactions.length } transaction{ data.transactions.length === 1 ? '' : 's' }
          </LinkInternal>
        </Skeleton>
      </DetailsInfoItem>

      <DetailsInfoItemDivider/>

      <DetailsInfoItem
        title="Global exit root"
        isLoading={ isPlaceholderData }
        flexWrap="nowrap"
      >
        <Skeleton isLoaded={ !isPlaceholderData } overflow="hidden">
          <HashStringShortenDynamic hash={ data.global_exit_root }/>
        </Skeleton>
        <CopyToClipboard text={ data.global_exit_root } isLoading={ isPlaceholderData }/>
      </DetailsInfoItem>
      <DetailsInfoItem
        title="Acc input hash"
        isLoading={ isPlaceholderData }
        flexWrap="nowrap"
      >
        <Skeleton isLoaded={ !isPlaceholderData } overflow="hidden">
          <HashStringShortenDynamic hash={ data.acc_input_hash }/>
        </Skeleton>
        <CopyToClipboard text={ data.acc_input_hash } isLoading={ isPlaceholderData }/>
      </DetailsInfoItem>
      <DetailsInfoItem
        title="Sequence tx hash"
        isLoading={ isPlaceholderData }
      >
        { data.sequence_tx_hash ? (
          <TxEntityL1
            isLoading={ isPlaceholderData }
            hash={ data.sequence_tx_hash }
            maxW="100%"
          />
        ) : <Text>Pending</Text> }
      </DetailsInfoItem>
      <DetailsInfoItem
        title="State root"
        isLoading={ isPlaceholderData }
        flexWrap="nowrap"
      >
        <Skeleton isLoaded={ !isPlaceholderData } overflow="hidden">
          <HashStringShortenDynamic hash={ data.state_root }/>
        </Skeleton>
        <CopyToClipboard text={ data.state_root } isLoading={ isPlaceholderData }/>
      </DetailsInfoItem>
    </Grid>
  );
};

export default ZkEvmL2TxnBatchDetails;
