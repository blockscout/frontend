import { Grid } from '@chakra-ui/react';
import React from 'react';

import type { BlockEpoch } from 'types/api/block';

import * as DetailsInfoItem from 'ui/shared/DetailsInfoItem';
import TokenTransferSnippet from 'ui/shared/TokenTransferSnippet/TokenTransferSnippet';

interface Props {
  data: BlockEpoch;
  isLoading?: boolean;
}

const BlockEpochRewardsDistribution = ({ data, isLoading }: Props) => {

  if (!data.distribution.community_transfer && !data.distribution.carbon_offsetting_transfer && !data.distribution.reserve_bolster_transfer) {
    return null;
  }

  return (
    <Grid
      columnGap={ 8 }
      rowGap={{ base: 3, lg: 3 }}
      templateColumns={{ base: 'minmax(0, 1fr)', lg: 'minmax(min-content, 200px) minmax(0, 1fr)' }}
      overflow="hidden"
    >
      { data.distribution.community_transfer && (
        <>
          <DetailsInfoItem.Label
            hint="Funds allocation to support Celo projects and community initiatives"
            isLoading={ isLoading }
          >
            Community fund
          </DetailsInfoItem.Label>
          <DetailsInfoItem.Value>
            <TokenTransferSnippet data={ data.distribution.community_transfer } isLoading={ isLoading } noAddressIcons={ false }/>
          </DetailsInfoItem.Value>
        </>
      ) }
      { data.distribution.carbon_offsetting_transfer && (
        <>
          <DetailsInfoItem.Label
            hint="Funds allocation to support projects that make Celo carbon-negative"
            isLoading={ isLoading }
          >
            Carbon offset fund
          </DetailsInfoItem.Label>
          <DetailsInfoItem.Value>
            <TokenTransferSnippet data={ data.distribution.carbon_offsetting_transfer } isLoading={ isLoading } noAddressIcons={ false }/>
          </DetailsInfoItem.Value>
        </>
      ) }
      { data.distribution.reserve_bolster_transfer && (
        <>
          <DetailsInfoItem.Label
            hint="Funds allocation to strengthen Celo’s reserve for network stability and security"
            isLoading={ isLoading }
          >
            Reserve bolster
          </DetailsInfoItem.Label>
          <DetailsInfoItem.Value>
            <TokenTransferSnippet data={ data.distribution.reserve_bolster_transfer } isLoading={ isLoading } noAddressIcons={ false }/>
          </DetailsInfoItem.Value>
        </>
      ) }
    </Grid>
  );
};

export default React.memo(BlockEpochRewardsDistribution);
