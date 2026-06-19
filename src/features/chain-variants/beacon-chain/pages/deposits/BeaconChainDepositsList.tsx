// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box } from '@chakra-ui/react';
import React from 'react';

import type { schemas } from '@blockscout/api-types';

import useLazyRenderedList from 'src/shared/lists/useLazyRenderedList';

import BeaconChainDepositsListItem from './BeaconChainDepositsListItem';

interface Props {
  isLoading?: boolean;
  items: Array<schemas['Deposit']>;
  view: 'list' | 'block' | 'address';
}

const DepositsList = ({ items, view, isLoading }: Props) => {
  const { cutRef, renderedItemsNum } = useLazyRenderedList(items, !isLoading);

  return (
    <Box>
      { items.slice(0, renderedItemsNum).map((item, index) => {

        const key = item.index + (isLoading ? String(index) : '');
        return (
          <BeaconChainDepositsListItem
            key={ key }
            item={ item }
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
