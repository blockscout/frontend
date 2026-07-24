// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box } from '@chakra-ui/react';
import React from 'react';

import type { ShibariumWithdrawalsItem } from 'src/features/rollup/shibarium/types/api';

import useLazyRenderedList from 'src/shared/lists/useLazyRenderedList';

import WithdrawalsListItem from './WithdrawalsListItem';

type Props = {
  items: Array<ShibariumWithdrawalsItem>;
  isLoading?: boolean;
  resetKey?: string;
};

const WithdrawalsList = ({ items, isLoading, resetKey }: Props) => {
  const { cutRef, renderedItemsNum } = useLazyRenderedList({ list: items, isEnabled: !isLoading, resetKey });

  return (
    <>
      <Box>
        { items.slice(0, renderedItemsNum).map((item, index) => (
          <WithdrawalsListItem
            key={ `${ item.l2_transaction_hash }-${ index }` }
            item={ item }
            isLoading={ isLoading }
          />
        )) }
      </Box>
      <Box ref={ cutRef } h={ 0 }/>
    </>
  );
};

export default WithdrawalsList;
