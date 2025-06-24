import { chakra } from '@chakra-ui/react';
import React from 'react';

import { CompactChainSelector, CompactNetworkSelector } from '../../shared/HomeChainSelector';

const TopBarChainSelector = () => {
  return (
    <chakra.div display="flex" flexDirection="row" alignItems="center" fontSize="var(--kda-explorer-top-bar-font-size)">
      <CompactNetworkSelector intent="warning"/>
      <chakra.span color="text.secondary" marginRight={ 1 }> @ </chakra.span>
      <CompactChainSelector intent="positive"/>
    </chakra.div>
  );
};

export default React.memo(TopBarChainSelector);
