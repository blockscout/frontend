// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box } from '@chakra-ui/react';
import React from 'react';

import type { schemas } from '@blockscout/api-types';

import useLazyRenderedList from 'src/shared/lists/useLazyRenderedList';

import BeaconChainWithdrawalsListItem from './BeaconChainWithdrawalsListItem';

interface Props {
  isLoading?: boolean;
  items: Array<schemas['BeaconWithdrawal']>;
  view: 'address' | 'block' | 'list';
};

const WithdrawalsList = ({ items, view, isLoading }: Props) => {
  const { cutRef, renderedItemsNum } = useLazyRenderedList(items, !isLoading);

  return (
    <Box>
      { items.slice(0, renderedItemsNum).map((item, index) => {

        const key = item.index + (isLoading ? String(index) : '');

        return (
          <BeaconChainWithdrawalsListItem
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

export default React.memo(WithdrawalsList);
