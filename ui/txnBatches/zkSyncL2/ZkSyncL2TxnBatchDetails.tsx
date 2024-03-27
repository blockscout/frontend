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
import DetailsInfoItem from 'ui/shared/DetailsInfoItem';
import DetailsInfoItemDivider from 'ui/shared/DetailsInfoItemDivider';
import DetailsTimestamp from 'ui/shared/DetailsTimestamp';
import LinkInternal from 'ui/shared/LinkInternal';
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

  const txNum = data.l2_tx_count + data.l1_tx_count;

  return (
    <Grid
      columnGap={ 8 }
      rowGap={{ base: 3, lg: 3 }}
      templateColumns={{ base: 'minmax(0, 1fr)', lg: 'minmax(min-content, 200px) minmax(0, 1fr)' }}
      overflow="hidden"
    >
      <DetailsInfoItem
        title="Tx batch number"
        hint="Batch number indicates the length of batches produced by grouping L2 blocks to be proven on Ethereum."
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
        hint="Status is the short interpretation of the batch lifecycle"
        isLoading={ isPlaceholderData }
      >
        <VerificationSteps steps={ ZKSYNC_L2_TX_BATCH_STATUSES.slice(1) } currentStep={ data.status } isLoading={ isPlaceholderData }/>
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
            { txNum } transaction{ txNum === 1 ? '' : 's' }
          </LinkInternal>
        </Skeleton>
      </DetailsInfoItem>

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

          <DetailsInfoItem
            title="Root hash"
            hint="L1 batch root is a hash that summarizes batch data and submitted to the L1"
            flexWrap="nowrap"
            alignSelf="flex-start"
          >
            <TruncatedValue value={ data.root_hash }/>
            <CopyToClipboard text={ data.root_hash }/>
          </DetailsInfoItem>

          <DetailsInfoItem
            title="L1 gas price"
            hint="Gas price for the batch settlement transaction on L1"
          >
            <Text mr={ 1 }>{ BigNumber(data.l1_gas_price).dividedBy(WEI).toFixed() } { currencyUnits.ether }</Text>
            <Text variant="secondary">({ BigNumber(data.l1_gas_price).dividedBy(WEI_IN_GWEI).toFixed() } { currencyUnits.gwei })</Text>
          </DetailsInfoItem>

          <DetailsInfoItem
            title="L2 fair gas price"
            hint={ 'The gas price below which the "baseFee" of the batch should not fall' }
          >
            <Text mr={ 1 }>{ BigNumber(data.l2_fair_gas_price).dividedBy(WEI).toFixed() } { currencyUnits.ether }</Text>
            <Text variant="secondary">({ BigNumber(data.l2_fair_gas_price).dividedBy(WEI_IN_GWEI).toFixed() } { currencyUnits.gwei })</Text>
          </DetailsInfoItem>
        </>
      ) }
    </Grid>
  );
};

export default ZkSyncL2TxnBatchDetails;
