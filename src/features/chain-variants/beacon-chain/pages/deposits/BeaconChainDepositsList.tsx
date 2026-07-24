// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box } from '@chakra-ui/react';
import React from 'react';

import type { schemas } from '@blockscout/api-types';

import useLazyRenderedList from 'src/shared/lists/useLazyRenderedList';

import BeaconChainDepositsListItem from './BeaconChainDepositsListItem';

interface Props {
  isLoading?: boolean;
  items: Array<schemas['BeaconDeposit']>;
  view: 'list' | 'block' | 'address';
  resetKey?: string;
}

const DepositsList = ({ items, view, isLoading, resetKey }: Props) => {
  const { cutRef, renderedItemsNum } = useLazyRenderedList({ list: items, isEnabled: !isLoading, resetKey });

  return (
    <>
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
      </Box>
      <Box ref={ cutRef } h={ 0 }/>
    </>
  );
};

export default React.memo(DepositsList);
