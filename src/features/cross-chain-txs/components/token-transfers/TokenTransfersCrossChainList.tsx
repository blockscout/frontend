// SPDX-License-Identifier: LicenseRef-Blockscout

import type { JsxStyleProps } from '@chakra-ui/react';
import { Box } from '@chakra-ui/react';
import React from 'react';

import type { InterchainTransfer } from '@blockscout/interchain-indexer-types';

import useLazyRenderedList from 'src/shared/lists/useLazyRenderedList';

import TokenTransfersCrossChainListItem from './TokenTransfersCrossChainListItem';
import { getItemKey } from './utils';

interface Props {
  items: Array<InterchainTransfer>;
  isLoading?: boolean;
  currentAddress?: string;
  resetKey?: string;
  listItemProps?: JsxStyleProps;
}

const TokenTransfersCrossChainList = ({ items, isLoading, currentAddress, resetKey, listItemProps }: Props) => {
  const { cutRef, renderedItemsNum } = useLazyRenderedList({ list: items, isEnabled: !isLoading, resetKey });

  return (
    <>
      <Box>
        { items.slice(0, renderedItemsNum).map((item, index) => (
          <TokenTransfersCrossChainListItem
            key={ getItemKey(item, isLoading ? index : undefined) }
            data={ item }
            isLoading={ isLoading }
            currentAddress={ currentAddress }
            { ...listItemProps }
          />
        )) }
      </Box>
      <Box ref={ cutRef } h={ 0 }/>
    </>
  );
};

export default React.memo(TokenTransfersCrossChainList);
