// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box } from '@chakra-ui/react';
import React from 'react';

import type { InterchainMessage } from '@blockscout/interchain-indexer-types';

import useLazyRenderedList from 'src/shared/lists/useLazyRenderedList';

import TransactionsCrossChainListItem from './TransactionsCrossChainListItem';

interface Props {
  items: Array<InterchainMessage>;
  isLoading?: boolean;
  currentAddress?: string;
  resetKey?: string;
}

const TransactionsCrossChainList = ({ items, isLoading, currentAddress, resetKey }: Props) => {
  const { cutRef, renderedItemsNum } = useLazyRenderedList({ list: items, isEnabled: !isLoading, resetKey });

  return (
    <>
      <Box>
        { items.slice(0, renderedItemsNum).map((item, index) => (
          <TransactionsCrossChainListItem
            key={ item.message_id + (isLoading ? index : '') }
            data={ item }
            isLoading={ isLoading }
            currentAddress={ currentAddress }
          />
        )) }
      </Box>
      <Box ref={ cutRef } h={ 0 }/>
    </>
  );
};

export default React.memo(TransactionsCrossChainList);
