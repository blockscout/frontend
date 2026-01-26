import { Box } from '@chakra-ui/react';
import React from 'react';

import multichainConfig from 'configs/multichain';
import useApiQuery from 'lib/api/useApiQuery';
import { CHAIN_METRICS } from 'stubs/optimismSuperchain';
import DataListDisplay from 'ui/shared/DataListDisplay';
import PageTitle from 'ui/shared/Page/PageTitle';

import OpSuperchainEcosystemsListItem from './OpSuperchainEcosystemsListItem';
import OpSuperchainEcosystemsTable from './OpSuperchainEcosystemsTable';

const OpSuperchainEcosystems = () => {

  const { data, isError, isPlaceholderData } = useApiQuery('multichainAggregator:chain_metrics', {
    queryOptions: {
      placeholderData: { items: Array(10).fill(CHAIN_METRICS) },
    },
  });

  const chains = multichainConfig()?.chains;

  const content = data?.items ? (
    <>
      <Box hideBelow="lg">
        <OpSuperchainEcosystemsTable data={ data.items } isLoading={ isPlaceholderData }/>
      </Box>
      <Box hideFrom="lg">
        { data.items.map((item, index) => (
          <OpSuperchainEcosystemsListItem
            key={ item.chain_id + (isPlaceholderData ? String(index) : '') }
            data={ item }
            chainInfo={ chains?.find((chain) => chain.id === item.chain_id) }
            isLoading={ isPlaceholderData }
          />
        )) }
      </Box>
    </>
  ) : null;

  return (
    <>
      <PageTitle
        title="Ecosystems"
        withTextAd
      />
      <DataListDisplay
        isError={ isError }
        itemsNum={ data?.items.length }
        emptyText="There are no chains in the cluster."
      >
        { content }
      </DataListDisplay>
    </>
  );
};

export default React.memo(OpSuperchainEcosystems);
