// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box } from '@chakra-ui/react';
import React from 'react';

import type { ShibariumDepositsItem } from 'src/features/rollup/shibarium/types/api';

import useLazyRenderedList from 'src/shared/lists/useLazyRenderedList';

import DepositsListItem from './DepositsListItem';

type Props = {
  items: Array<ShibariumDepositsItem>;
  isLoading?: boolean;
  resetKey?: string;
};

const DepositsList = ({ items, isLoading, resetKey }: Props) => {
  const { cutRef, renderedItemsNum } = useLazyRenderedList({ list: items, isEnabled: !isLoading, resetKey });

  return (
    <>
      <Box>
        { items.slice(0, renderedItemsNum).map((item, index) => (
          <DepositsListItem
            key={ `${ item.l2_transaction_hash }-${ index }` }
            isLoading={ isLoading }
            item={ item }
          />
        )) }
      </Box>
      <Box ref={ cutRef } h={ 0 }/>
    </>
  );
};

export default DepositsList;
