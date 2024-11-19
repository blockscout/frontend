import { Grid, GridItem, Link, Skeleton, Text } from '@chakra-ui/react';
import type { UseQueryResult } from '@tanstack/react-query';
import BigNumber from 'bignumber.js';
import { useRouter } from 'next/router';
import React from 'react';
import { scroller, Element } from 'react-scroll';

import { ZKSYNC_L2_TX_BATCH_STATUSES, type ZkSyncBatch } from 'types/api/zkSyncL2';

import { route } from 'nextjs-routes';

import type { ResourceError } from 'lib/api/resources';
import { WEI, WEI_IN_GWEI } from 'lib/consts';
import throwOnResourceLoadError from 'lib/errors/throwOnResourceLoadError';
import { currencyUnits } from 'lib/units';
import isCustomAppError from 'ui/shared/AppError/isCustomAppError';
import CopyToClipboard from 'ui/shared/CopyToClipboard';
import DataFetchAlert from 'ui/shared/DataFetchAlert';
import * as DetailsInfoItem from 'ui/shared/DetailsInfoItem';
import DetailsInfoItemDivider from 'ui/shared/DetailsInfoItemDivider';
import DetailsTimestamp from 'ui/shared/DetailsTimestamp';
import LinkInternal from 'ui/shared/links/LinkInternal';
import PrevNext from 'ui/shared/PrevNext';
import TruncatedValue from 'ui/shared/TruncatedValue';
import VerificationSteps from 'ui/shared/verificationSteps/VerificationSteps';

import ZkSyncL2TxnBatchHashesInfo from './ZkSyncL2TxnBatchHashesInfo';

interface Props {
  query: UseQueryResult<ZkSyncBatch, ResourceError>;
}

const ZkSyncL2TxnBatchDetails = ({ query }: Props) => {
  const router = useRouter();
  const [ isExpanded, setIsExpanded ] = React.useState(false);

  const { data, isPlaceholderData, isError, error } = query;

  const handlePrevNextClick = React.useCallback((direction: 'prev' | 'next') => {
    if (!data) {
      return;
    }

    const increment = direction === 'next' ? +1 : -1;
    const nextId = String(data.number + increment);

    router.push({ pathname: '/batches/[number]', query: { number: nextId } }, undefined);
  }, [ data, router ]);

  const handleCutClick = React.useCallback(() => {
    setIsExpanded((flag) => !flag);
    scroller.scrollTo('ZkSyncL2TxnBatchDetails__cutLink', {
      duration: 500,
      smooth: true,
    });
  }, []);

  if (isError) {
    if (isCustomAppError(error)) {
      throwOnResourceLoadError({ isError, error });
    }

    return <DataFetchAlert/>;
  }

  if (!data) {
    return null;
  }

  const txNum = data.l2_transaction_count + data.l1_transaction_count;

  return (
    <Grid
      columnGap={ 8 }
      rowGap={{ base: 3, lg: 3 }}
      templateColumns={{ base: 'minmax(0, 1fr)', lg: 'minmax(min-content, 200px) minmax(0, 1fr)' }}
      overflow="hidden"
    >
      <DetailsInfoItem.Label
        hint="Batch number indicates the length of batches produced by grouping L2 blocks to be proven on Ethereum."
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
        hint="Status is the short interpretation of the batch lifecycle"
        isLoading={ isPlaceholderData }
      >
        Status
      </DetailsInfoItem.Label>
      <DetailsInfoItem.Value>
        <VerificationSteps steps={ ZKSYNC_L2_TX_BATCH_STATUSES.slice(1) } currentStep={ data.status } isLoading={ isPlaceholderData }/>
      </DetailsInfoItem.Value>

      <DetailsInfoItem.Label
        hint="Date and time at which batch is produced"
        isLoading={ isPlaceholderData }
      >
        Timestamp
      </DetailsInfoItem.Label>
      <DetailsInfoItem.Value>
        { data.timestamp ? <DetailsTimestamp timestamp={ data.timestamp } isLoading={ isPlaceholderData }/> : 'Undefined' }
      </DetailsInfoItem.Value>

      <DetailsInfoItem.Label
        hint="Number of transactions inside the batch."
        isLoading={ isPlaceholderData }
      >
        Transactions
      </DetailsInfoItem.Label>
      <DetailsInfoItem.Value>
        <Skeleton isLoaded={ !isPlaceholderData }>
          <LinkInternal href={ route({ pathname: '/batches/[number]', query: { number: data.number.toString(), tab: 'txs' } }) }>
            { txNum } transaction{ txNum === 1 ? '' : 's' }
          </LinkInternal>
        </Skeleton>
      </DetailsInfoItem.Value>

      <DetailsInfoItemDivider/>

      <ZkSyncL2TxnBatchHashesInfo isLoading={ isPlaceholderData } data={ data }/>

      <GridItem colSpan={{ base: undefined, lg: 2 }}>
        <Element name="ZkSyncL2TxnBatchDetails__cutLink">
          <Skeleton isLoaded={ !isPlaceholderData } mt={ 6 } display="inline-block">
            <Link
              display="inline-block"
              fontSize="sm"
              textDecorationLine="underline"
              textDecorationStyle="dashed"
              onClick={ handleCutClick }
            >
              { isExpanded ? 'Hide details' : 'View details' }
            </Link>
          </Skeleton>
        </Element>
      </GridItem>

      { isExpanded && (
        <>
          <GridItem colSpan={{ base: undefined, lg: 2 }} mt={{ base: 1, lg: 4 }}/>

          <DetailsInfoItem.Label
            hint="L1 batch root is a hash that summarizes batch data and submitted to the L1"
          >
            Root hash
          </DetailsInfoItem.Label>
          <DetailsInfoItem.Value
            flexWrap="nowrap"
            alignSelf="flex-start"
          >
            <TruncatedValue value={ data.root_hash }/>
            <CopyToClipboard text={ data.root_hash }/>
          </DetailsInfoItem.Value>

          <DetailsInfoItem.Label
            hint="Gas price for the batch settlement transaction on L1"
          >
            L1 gas price
          </DetailsInfoItem.Label>
          <DetailsInfoItem.Value>
            <Text mr={ 1 }>{ BigNumber(data.l1_gas_price).dividedBy(WEI).toFixed() } { currencyUnits.ether }</Text>
            <Text variant="secondary">({ BigNumber(data.l1_gas_price).dividedBy(WEI_IN_GWEI).toFixed() } { currencyUnits.gwei })</Text>
          </DetailsInfoItem.Value>

          <DetailsInfoItem.Label
            hint='The gas price below which the "baseFee" of the batch should not fall'
          >
            L2 fair gas price
          </DetailsInfoItem.Label>
          <DetailsInfoItem.Value>
            <Text mr={ 1 }>{ BigNumber(data.l2_fair_gas_price).dividedBy(WEI).toFixed() } { currencyUnits.ether }</Text>
            <Text variant="secondary">({ BigNumber(data.l2_fair_gas_price).dividedBy(WEI_IN_GWEI).toFixed() } { currencyUnits.gwei })</Text>
          </DetailsInfoItem.Value>
        </>
      ) }
    </Grid>
  );
};

export default ZkSyncL2TxnBatchDetails;
