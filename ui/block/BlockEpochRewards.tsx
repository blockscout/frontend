import React from 'react';

import useApiQuery from 'lib/api/useApiQuery';
import { BLOCK_EPOCH } from 'stubs/block';
import DataFetchAlert from 'ui/shared/DataFetchAlert';

import BlockEpochElectionRewards from './epochRewards/BlockEpochElectionRewards';
import BlockEpochRewardsDistribution from './epochRewards/BlockEpochRewardsDistribution';

interface Props {
  heightOrHash: string;
}

const BlockEpochRewards = ({ heightOrHash }: Props) => {
  const query = useApiQuery('general:block_epoch', {
    pathParams: {
      height_or_hash: heightOrHash,
    },
    queryOptions: {
      placeholderData: BLOCK_EPOCH,
    },
  });

  if (query.isError) {
    return <DataFetchAlert/>;
  }

  if (!query.data || (!query.data.aggregated_election_rewards && !query.data.distribution)) {
    return <span>No block epoch rewards data</span>;
  }

  return (
    <>
      <BlockEpochRewardsDistribution data={ query.data } isLoading={ query.isPlaceholderData }/>
      <BlockEpochElectionRewards data={ query.data } isLoading={ query.isPlaceholderData }/>
    </>
  );
};

export default React.memo(BlockEpochRewards);
