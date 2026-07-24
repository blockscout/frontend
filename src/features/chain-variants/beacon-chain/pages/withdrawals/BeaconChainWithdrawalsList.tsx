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
  resetKey?: string;
};

const WithdrawalsList = ({ items, view, isLoading, resetKey }: Props) => {
  const { cutRef, renderedItemsNum } = useLazyRenderedList({ list: items, isEnabled: !isLoading, resetKey });

  return (
    <>
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
      </Box>
      <Box ref={ cutRef } h={ 0 }/>
    </>
  );
};

export default React.memo(WithdrawalsList);
