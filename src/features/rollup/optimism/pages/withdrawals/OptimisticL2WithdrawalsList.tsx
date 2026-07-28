// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box } from '@chakra-ui/react';
import React from 'react';

import type { schemas } from '@blockscout/api-types';

import useLazyRenderedList from 'src/shared/lists/useLazyRenderedList';

import OptimisticL2WithdrawalsListItem from './OptimisticL2WithdrawalsListItem';

type Props = {
  items: Array<schemas['OptimismWithdrawal']>;
  isLoading?: boolean;
  resetKey?: string;
};

const OptimisticL2WithdrawalsList = ({ items, isLoading, resetKey }: Props) => {
  const { cutRef, renderedItemsNum } = useLazyRenderedList({ list: items, isEnabled: !isLoading, resetKey });

  return (
    <>
      <Box>
        { items.slice(0, renderedItemsNum).map((item, index) => (
          <OptimisticL2WithdrawalsListItem
            key={ String(item.msg_nonce_version) + item.msg_nonce + (isLoading ? index : '') }
            item={ item }
            isLoading={ isLoading }
          />
        )) }
      </Box>
      <Box ref={ cutRef } h={ 0 }/>
    </>
  );
};

export default OptimisticL2WithdrawalsList;
