// SPDX-License-Identifier: LicenseRef-Blockscout

import type { UseQueryResult } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { route } from 'nextjs-routes';
import React from 'react';

import type { schemas } from '@blockscout/api-types';

import type { ResourceError } from 'src/api/resources';

import BlockEntityL1 from 'src/features/rollup/common/components/BlockEntityL1';
import TxEntityL1 from 'src/features/rollup/common/components/TxEntityL1';
import { layerLabels } from 'src/features/rollup/common/utils/layer';
import ScrollL2TxnBatchDA from 'src/features/rollup/scroll/components/ScrollL2TxnBatchDA';
import ScrollL2TxnBatchStatus from 'src/features/rollup/scroll/components/ScrollL2TxnBatchStatus';

import ApiFetchAlert from 'src/shared/alerts/ApiFetchAlert';
import PrevNext from 'src/shared/buttons/PrevNext';
import * as DetailedInfo from 'src/shared/detailed-info/DetailedInfo';
import DetailedInfoTimestamp from 'src/shared/detailed-info/DetailedInfoTimestamp';
import isCustomAppError from 'src/shared/errors/is-custom-app-error';
import throwOnResourceLoadError from 'src/shared/errors/throw-on-resource-load-error';

import { Link } from 'src/toolkit/chakra/link';
import { Skeleton } from 'src/toolkit/chakra/skeleton';
interface Props {
  query: UseQueryResult<schemas['ScrollBatch'], ResourceError>;
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

    return <ApiFetchAlert/>;
  }

  if (!data) {
    return null;
  }

  const blocksCount = data.end_block_number && data.start_block_number ? data.end_block_number - data.start_block_number + 1 : 0;

  return (
    <DetailedInfo.Container
      templateColumns={{ base: 'minmax(0, 1fr)', lg: 'minmax(min-content, 200px) minmax(0, 1fr)' }}
    >
      <DetailedInfo.ItemLabel
        isLoading={ isPlaceholderData }
        hint={ `Batch number indicates the length of batches produced by grouping ${ layerLabels.current } blocks to be proven on ${ layerLabels.parent }` }
      >
        Txn batch number
      </DetailedInfo.ItemLabel>
      <DetailedInfo.ItemValue>
        <Skeleton loading={ isPlaceholderData }>
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
      </DetailedInfo.ItemValue>

      <DetailedInfo.ItemLabel
        isLoading={ isPlaceholderData }
        hint="Data availability container"
      >
        Container
      </DetailedInfo.ItemLabel>
      <DetailedInfo.ItemValue>
        <ScrollL2TxnBatchDA container={ data.data_availability.batch_data_container } isLoading={ isPlaceholderData }/>
      </DetailedInfo.ItemValue>

      <DetailedInfo.ItemLabel
        isLoading={ isPlaceholderData }
        hint="Status of this batch"
      >
        Status
      </DetailedInfo.ItemLabel>
      <DetailedInfo.ItemValue>
        <ScrollL2TxnBatchStatus status={ data.confirmation_transaction.hash ? 'Finalized' : 'Committed' } isLoading={ isPlaceholderData }/>
      </DetailedInfo.ItemValue>

      <DetailedInfo.ItemLabel
        isLoading={ isPlaceholderData }
        hint={ `Date and time at which batch is finalized to ${ layerLabels.parent }` }
      >
        Finalized timestamp
      </DetailedInfo.ItemLabel>
      <DetailedInfo.ItemValue>
        { data.confirmation_transaction.timestamp ?
          <DetailedInfoTimestamp timestamp={ data.confirmation_transaction.timestamp } isLoading={ isPlaceholderData }/> :
          <Skeleton loading={ isPlaceholderData } display="inline-block">Pending</Skeleton>
        }
      </DetailedInfo.ItemValue>

      { typeof data.transactions_count === 'number' ? (
        <>
          <DetailedInfo.ItemLabel
            isLoading={ isPlaceholderData }
            hint="Number of transactions in this batch"
          >
            Transactions
          </DetailedInfo.ItemLabel>
          <DetailedInfo.ItemValue>
            <Link loading={ isPlaceholderData } href={ route({ pathname: '/batches/[number]', query: { number: data.number.toString(), tab: 'txs' } }) }>
              { data.transactions_count.toLocaleString() } transaction{ data.transactions_count === 1 ? '' : 's' }
            </Link>
          </DetailedInfo.ItemValue>
        </>
      ) : null }

      <DetailedInfo.ItemLabel
        isLoading={ isPlaceholderData }
        hint={ `Number of ${ layerLabels.current } blocks in this batch` }
      >
        Blocks
      </DetailedInfo.ItemLabel>
      <DetailedInfo.ItemValue>
        <Link loading={ isPlaceholderData } href={ route({ pathname: '/batches/[number]', query: { number: data.number.toString(), tab: 'blocks' } }) }>
          { blocksCount.toLocaleString() } block{ blocksCount === 1 ? '' : 's' }
        </Link>
      </DetailedInfo.ItemValue>

      <DetailedInfo.ItemLabel
        isLoading={ isPlaceholderData }
        hint={ `Date and time at which batch is committed to ${ layerLabels.parent }` }
      >
        Committed timestamp
      </DetailedInfo.ItemLabel>
      <DetailedInfo.ItemValue>
        { data.commitment_transaction.timestamp ?
          <DetailedInfoTimestamp timestamp={ data.commitment_transaction.timestamp } isLoading={ isPlaceholderData }/> :
          <Skeleton loading={ isPlaceholderData } display="inline-block">Pending</Skeleton>
        }
      </DetailedInfo.ItemValue>

      <DetailedInfo.ItemLabel
        isLoading={ isPlaceholderData }
        hint={ `Hash of ${ layerLabels.parent } transaction this batch was committed in` }
      >
        Committed transaction hash
      </DetailedInfo.ItemLabel>
      <DetailedInfo.ItemValue alignSelf="flex-start">
        <TxEntityL1
          isLoading={ isPlaceholderData }
          hash={ data.commitment_transaction.hash }
          maxW="100%"
          noCopy

        />
      </DetailedInfo.ItemValue>

      <DetailedInfo.ItemLabel
        isLoading={ isPlaceholderData }
        hint={ `${ layerLabels.parent } block that includes transaction with this batch commitment` }
      >
        Committed block
      </DetailedInfo.ItemLabel>
      <DetailedInfo.ItemValue>
        <BlockEntityL1
          isLoading={ isPlaceholderData }
          number={ data.commitment_transaction.block_number }
        />
      </DetailedInfo.ItemValue>

      <DetailedInfo.ItemLabel
        isLoading={ isPlaceholderData }
        hint={ `Hash of ${ layerLabels.parent } transaction this batch was finalized in` }
      >
        Finalized transaction hash
      </DetailedInfo.ItemLabel>
      <DetailedInfo.ItemValue alignSelf="flex-start">
        { data.confirmation_transaction.hash ? (
          <TxEntityL1
            isLoading={ isPlaceholderData }
            hash={ data.confirmation_transaction.hash }
            maxW="100%"
            noCopy
          />
        ) : <Skeleton loading={ isPlaceholderData } display="inline-block">Pending</Skeleton> }
      </DetailedInfo.ItemValue>

      <DetailedInfo.ItemLabel
        isLoading={ isPlaceholderData }
        hint={ `${ layerLabels.parent } block that includes transaction with this batch finalization data` }
      >
        Finalized block
      </DetailedInfo.ItemLabel>
      <DetailedInfo.ItemValue>
        { data.confirmation_transaction.block_number ? (
          <BlockEntityL1
            isLoading={ isPlaceholderData }
            number={ data.confirmation_transaction.block_number }
          />
        ) : <Skeleton loading={ isPlaceholderData } display="inline-block">Pending</Skeleton> }
      </DetailedInfo.ItemValue>
    </DetailedInfo.Container>
  );
};

export default ScrollL2TxnBatchDetails;
