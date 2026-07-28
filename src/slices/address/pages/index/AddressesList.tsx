// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box } from '@chakra-ui/react';
import type BigNumber from 'bignumber.js';
import React from 'react';

import type { schemas } from '@blockscout/api-types';

import useLazyRenderedList from 'src/shared/lists/useLazyRenderedList';

import AddressesListItem from './AddressesListItem';

interface Props {
  items: Array<schemas['TopAddress']>;
  totalSupply: BigNumber;
  pageStartIndex: number;
  isLoading?: boolean;
  resetKey?: string;
}

const AddressesList = ({ items, totalSupply, pageStartIndex, isLoading, resetKey }: Props) => {
  const { cutRef, renderedItemsNum } = useLazyRenderedList({ list: items, isEnabled: !isLoading, resetKey });

  return (
    <>
      <Box>
        { items.slice(0, renderedItemsNum).map((item, index) => (
          <AddressesListItem
            key={ item.hash + (isLoading ? index : '') }
            item={ item }
            index={ pageStartIndex + index }
            totalSupply={ totalSupply }
            isLoading={ isLoading }
          />
        )) }
      </Box>
      <Box ref={ cutRef } h={ 0 }/>
    </>
  );
};

export default React.memo(AddressesList);
