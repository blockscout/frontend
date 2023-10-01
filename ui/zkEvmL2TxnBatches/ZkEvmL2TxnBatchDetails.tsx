import { Grid, GridItem, Text, Skeleton } from '@chakra-ui/react';
import type { UseQueryResult } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import React from 'react';

import type { ZkEvmL2TxnBatch } from 'types/api/zkEvml2TxnBatches';

import clockIcon from 'icons/clock.svg';
import type { ResourceError } from 'lib/api/resources';
import dayjs from 'lib/date/dayjs';
import Icon from 'ui/shared/chakra/Icon';
import DataFetchAlert from 'ui/shared/DataFetchAlert';
import DetailsInfoItem from 'ui/shared/DetailsInfoItem';
import TxEntityL1 from 'ui/shared/entities/tx/TxEntityL1';
import PrevNext from 'ui/shared/PrevNext';
import TextSeparator from 'ui/shared/TextSeparator';

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

  const sectionGap = (
    <GridItem
      colSpan={{ base: undefined, lg: 2 }}
      mt={{ base: 2, lg: 3 }}
      mb={{ base: 0, lg: 3 }}
      borderBottom="1px solid"
      borderColor="divider"
    />
  );

  return (
    <Grid
      columnGap={ 8 }
      rowGap={{ base: 3, lg: 3 }}
      templateColumns={{ base: 'minmax(0, 1fr)', lg: 'minmax(min-content, 200px) minmax(0, 1fr)' }}
      overflow="hidden"
    >
      <DetailsInfoItem
        title="Tx batch number"
        // hint="The block height of a particular block is defined as the number of blocks preceding it in the blockchain"
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
        // hint="Size of the block in bytes"
        isLoading={ isPlaceholderData }
      >
        <Skeleton isLoaded={ !isPlaceholderData }>
          { data.status }
        </Skeleton>
      </DetailsInfoItem>
      <DetailsInfoItem
        title="Verify timestamp"
        // hint="Date & time at which block was produced."
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
        // hint="Date & time at which block was produced."
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
        hint="The number of transactions in the batch"
        isLoading={ isPlaceholderData }
      >
        <Skeleton isLoaded={ !isPlaceholderData }>
          { /* <LinkInternal href={ route({ pathname: '/block/[height_or_hash]', query: { height_or_hash: heightOrHash, tab: 'txs' } }) }> */ }
          { data.transactions.length } transaction{ data.transactions.length === 1 ? '' : 's' }
          { /* </LinkInternal> */ }
        </Skeleton>
      </DetailsInfoItem>

      { sectionGap }

      <DetailsInfoItem
        title="Global exit root"
        //   hint=''
        isLoading={ isPlaceholderData }
      >
        <Skeleton isLoaded={ !isPlaceholderData }>
          { data.global_exit_root }
        </Skeleton>
      </DetailsInfoItem>
      <DetailsInfoItem
        title="Acc input hash"
        //   hint=''
        isLoading={ isPlaceholderData }
      >
        <Skeleton isLoaded={ !isPlaceholderData }>
          { data.acc_input_hash }
        </Skeleton>
      </DetailsInfoItem>
      <DetailsInfoItem
        title="Sequence tx hash"
        //   hint=''
        isLoading={ isPlaceholderData }
      >
        { data.sequence_tx_hash ? (
          <TxEntityL1
            isLoading={ isPlaceholderData }
            hash={ data.sequence_tx_hash }
            maxW="100%"
          />
        ) : <Text>pending</Text> }
        { /* Not sertain how to display pending state */ }
      </DetailsInfoItem>
      <DetailsInfoItem
        title="State root"
        //   hint=''
        isLoading={ isPlaceholderData }
      >
        <Skeleton isLoaded={ !isPlaceholderData }>
          { data.state_root }
        </Skeleton>
      </DetailsInfoItem>
    </Grid>
  );
};

export default ZkEvmL2TxnBatchDetails;
