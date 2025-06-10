import { Grid, chakra } from '@chakra-ui/react';
import React from 'react';

import type { CeloEpochDetails } from 'types/api/epochs';

import config from 'configs/app';
import getCurrencyValue from 'lib/getCurrencyValue';
import useIsMobile from 'lib/hooks/useIsMobile';
import { Skeleton } from 'toolkit/chakra/skeleton';
import * as DetailedInfo from 'ui/shared/DetailedInfo/DetailedInfo';
import BlockEntity from 'ui/shared/entities/block/BlockEntity';
import TokenEntity from 'ui/shared/entities/token/TokenEntity';
import TokenTransferSnippet from 'ui/shared/TokenTransferSnippet/TokenTransferSnippet';

import EpochElectionRewards from './electionRewards/EpochElectionRewards';

interface Props {
  data: CeloEpochDetails;
  isLoading?: boolean;
}

const EpochDetails = ({ data, isLoading }: Props) => {
  const isMobile = useIsMobile();

  const totalFunRewards = data.distribution?.transfers_total?.total ? getCurrencyValue({
    value: data.distribution?.transfers_total.total.value,
    decimals: data.distribution?.transfers_total.total.decimals,
  }) : null;

  return (
    <>
      <Grid columnGap={ 8 } rowGap={ 3 } templateColumns={{ base: 'minmax(0, 1fr)', lg: 'max-content minmax(728px, auto)' }}>
        <DetailedInfo.ItemLabel
        // eslint-disable-next-line max-len
          hint={ `The range of blocks during which the epoch is processed — i.e., from the block where the "EpochProcessingStarted" event is emitted to the block where the "EpochProcessingEnded" event is emitted` }
          isLoading={ isLoading }
        >
          Processing range
        </DetailedInfo.ItemLabel>
        <DetailedInfo.ItemValue>
          <BlockEntity number={ data.start_processing_block_number } isLoading={ isLoading } noIcon/>
          <chakra.span color="text.secondary" whiteSpace="pre"> - </chakra.span>
          <BlockEntity number={ data.end_processing_block_number } isLoading={ isLoading } noIcon/>
        </DetailedInfo.ItemValue>
        { data.distribution?.community_transfer && (
          <>
            <DetailedInfo.ItemLabel
              hint="Funds allocation to support Celo projects and community initiatives"
              isLoading={ isLoading }
            >
              Community fund
            </DetailedInfo.ItemLabel>
            <DetailedInfo.ItemValue>
              <TokenTransferSnippet
                data={ data.distribution.community_transfer }
                isLoading={ isLoading }
                noAddressIcons={ isMobile }
              />
            </DetailedInfo.ItemValue>
          </>
        ) }
        { data.distribution?.carbon_offsetting_transfer && (
          <>
            <DetailedInfo.ItemLabel
              hint="Funds allocation to support projects that make Celo carbon-negative"
              isLoading={ isLoading }
            >
              Carbon offset fund
            </DetailedInfo.ItemLabel>
            <DetailedInfo.ItemValue>
              <TokenTransferSnippet
                data={ data.distribution.carbon_offsetting_transfer }
                isLoading={ isLoading }
                noAddressIcons={ isMobile }
              />
            </DetailedInfo.ItemValue>
          </>
        ) }
        { totalFunRewards && (
          <>
            <DetailedInfo.ItemLabel
              hint="Sum of all fund allocations"
              isLoading={ isLoading }
            >
              Total fund rewards
            </DetailedInfo.ItemLabel>
            <DetailedInfo.ItemValue flexWrap="nowrap" gap={ 2 }>
              <Skeleton loading={ isLoading }>
                <span>{ totalFunRewards.valueStr }</span>
              </Skeleton>
              { data.distribution?.transfers_total?.token ? (
                <TokenEntity
                  token={ data.distribution?.transfers_total.token }
                  isLoading={ isLoading }
                  noCopy
                  onlySymbol
                />
              ) :
                config.chain.currency.symbol }
            </DetailedInfo.ItemValue>
          </>
        ) }
      </Grid>
      <EpochElectionRewards data={ data } isLoading={ isLoading }/>
    </>
  );
};

export default React.memo(EpochDetails);
