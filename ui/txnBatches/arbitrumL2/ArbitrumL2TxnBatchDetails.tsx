import { Grid, GridItem, Link, Skeleton } from '@chakra-ui/react';
import type { UseQueryResult } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import React from 'react';
import { scroller, Element } from 'react-scroll';

import type { ArbitrumL2TxnBatch } from 'types/api/arbitrumL2';

import { route } from 'nextjs-routes';

import type { ResourceError } from 'lib/api/resources';
import throwOnResourceLoadError from 'lib/errors/throwOnResourceLoadError';
import isCustomAppError from 'ui/shared/AppError/isCustomAppError';
import ArbitrumL2TxnBatchDA from 'ui/shared/batch/ArbitrumL2TxnBatchDA';
import CopyToClipboard from 'ui/shared/CopyToClipboard';
import DataFetchAlert from 'ui/shared/DataFetchAlert';
import * as DetailsInfoItem from 'ui/shared/DetailsInfoItem';
import DetailsTimestamp from 'ui/shared/DetailsTimestamp';
import BlockEntityL1 from 'ui/shared/entities/block/BlockEntityL1';
import TxEntityL1 from 'ui/shared/entities/tx/TxEntityL1';
import HashStringShortenDynamic from 'ui/shared/HashStringShortenDynamic';
import LinkInternal from 'ui/shared/links/LinkInternal';
import PrevNext from 'ui/shared/PrevNext';

import ArbitrumL2TxnBatchDetailsDA from './ArbitrumL2TxnBatchDetailsDA';
interface Props {
  query: UseQueryResult<ArbitrumL2TxnBatch, ResourceError>;
}

const ArbitrumL2TxnBatchDetails = ({ query }: Props) => {
  const router = useRouter();
  const [ isExpanded, setIsExpanded ] = React.useState(false);

  const handleCutClick = React.useCallback(() => {
    setIsExpanded((flag) => !flag);
    scroller.scrollTo('BatchDetails__cutLink', {
      duration: 500,
      smooth: true,
    });
  }, []);

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
        Tx batch number
      </DetailsInfoItem.Label>
      <DetailsInfoItem.Value>
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
      </DetailsInfoItem.Value>

      <DetailsInfoItem.Label
        isLoading={ isPlaceholderData }
        hint="Date and time at which batch is submitted to L1"
      >
        Timestamp
      </DetailsInfoItem.Label>
      <DetailsInfoItem.Value>
        { data.commitment_transaction.timestamp ?
          <DetailsTimestamp timestamp={ data.commitment_transaction.timestamp }isLoading={ isPlaceholderData }/> :
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
          <LinkInternal href={ route({ pathname: '/batches/[number]', query: { number: data.number.toString(), tab: 'txs' } }) }>
            { data.transactions_count.toLocaleString() } transaction{ data.transactions_count === 1 ? '' : 's' }
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
        hint="Hash of L1 transaction in which transactions was committed"
      >
        L1 transaction hash
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
        hint="Heigh of L1 block which includes L1 transactions"
      >
        L1 block
      </DetailsInfoItem.Label>
      <DetailsInfoItem.Value>
        <BlockEntityL1
          isLoading={ isPlaceholderData }
          number={ data.commitment_transaction.block_number }
        />
      </DetailsInfoItem.Value>

      { data.data_availability.batch_data_container && (
        <>
          <DetailsInfoItem.Label
            isLoading={ isPlaceholderData }
            hint="Where the batch data is stored"
          >
            Batch data container
          </DetailsInfoItem.Label><DetailsInfoItem.Value>
            <ArbitrumL2TxnBatchDA dataContainer={ data.data_availability.batch_data_container } isLoading={ isPlaceholderData }/>
          </DetailsInfoItem.Value>
        </>
      ) }

      <DetailsInfoItem.Label
        isLoading={ isPlaceholderData }
        hint="The hash of the state before the batch"
      >
        Before acc
      </DetailsInfoItem.Label>
      <DetailsInfoItem.Value>
        <Skeleton isLoaded={ !isPlaceholderData } overflow="hidden">
          <HashStringShortenDynamic hash={ data.before_acc }/>
          <CopyToClipboard text={ data.before_acc }/>
        </Skeleton>
      </DetailsInfoItem.Value>

      <DetailsInfoItem.Label
        isLoading={ isPlaceholderData }
        hint="The hash of the state after the batch"
      >
        After acc
      </DetailsInfoItem.Label>
      <DetailsInfoItem.Value>
        <Skeleton isLoaded={ !isPlaceholderData } overflow="hidden">
          <HashStringShortenDynamic hash={ data.after_acc }/>
          <CopyToClipboard text={ data.after_acc }/>
        </Skeleton>
      </DetailsInfoItem.Value>

      { data.data_availability.batch_data_container === 'in_anytrust' && (
        <>
          { /* CUT */ }
          <GridItem colSpan={{ base: undefined, lg: 2 }}>
            <Element name="BatchDetails__cutLink">
              <Skeleton isLoaded={ !isPlaceholderData } mt={ 6 } display="inline-block">
                <Link
                  fontSize="sm"
                  textDecorationLine="underline"
                  textDecorationStyle="dashed"
                  onClick={ handleCutClick }
                >
                  { isExpanded ? 'Hide data availability info' : 'Show data availability info' }
                </Link>
              </Skeleton>
            </Element>
          </GridItem>

          { /* ADDITIONAL INFO */ }
          { isExpanded && !isPlaceholderData && (
            <>
              <GridItem colSpan={{ base: undefined, lg: 2 }} mt={{ base: 1, lg: 4 }}/>

              <ArbitrumL2TxnBatchDetailsDA dataAvailability={ data.data_availability }/>
            </>
          ) }
        </>
      ) }
    </Grid>
  );
};

export default ArbitrumL2TxnBatchDetails;
