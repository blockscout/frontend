// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box } from '@chakra-ui/react';
import React from 'react';

import type * as multichain from '@blockscout/multichain-aggregator-types';

import multichainConfig from 'src/features/multichain/chains-config';

import useLazyRenderedList from 'src/shared/lists/useLazyRenderedList';

import MultichainEcosystemsListItem from './MultichainEcosystemsListItem';

interface Props {
  data: Array<multichain.ChainMetrics>;
  isLoading?: boolean;
  resetKey?: string;
}

const MultichainEcosystemsList = ({ data, isLoading, resetKey }: Props) => {
  const chains = multichainConfig()?.chains;
  const { cutRef, renderedItemsNum } = useLazyRenderedList({ list: data, isEnabled: !isLoading, resetKey });

  return (
    <>
      <Box>
        { data.slice(0, renderedItemsNum).map((item, index) => (
          <MultichainEcosystemsListItem
            key={ item.chain_id + (isLoading ? String(index) : '') }
            data={ item }
            chainInfo={ chains?.find((chain) => chain.id === item.chain_id) }
            isLoading={ isLoading }
          />
        )) }
      </Box>
      <Box ref={ cutRef } h={ 0 }/>
    </>
  );
};

export default React.memo(MultichainEcosystemsList);
