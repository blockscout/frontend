// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box } from '@chakra-ui/react';
import React from 'react';

import type { DepositsItem } from 'client/features/chain-variants/beacon-chain/types/api';

import useLazyRenderedList from 'client/shared/lists/useLazyRenderedList';

import BeaconChainDepositsListItem from './BeaconChainDepositsListItem';

type Props = {
  isLoading?: boolean;
} & ({
  items: Array<DepositsItem>;
  view: 'list' | 'block' | 'address';
});

const DepositsList = ({ items, view, isLoading }: Props) => {
  const { cutRef, renderedItemsNum } = useLazyRenderedList(items, !isLoading);

  return (
    <Box>
      { items.slice(0, renderedItemsNum).map((item, index) => {

        const key = item.index + (isLoading ? String(index) : '');
        return (
          <BeaconChainDepositsListItem
            key={ key }
            item={ item as DepositsItem }
            view={ view }
            isLoading={ isLoading }
          />
        );
      }) }
      <div ref={ cutRef }/>
    </Box>
  );
};

export default React.memo(DepositsList);
