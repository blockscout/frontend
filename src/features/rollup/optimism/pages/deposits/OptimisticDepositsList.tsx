// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box } from '@chakra-ui/react';
import React from 'react';

import type { schemas } from '@blockscout/api-types';

import useLazyRenderedList from 'src/shared/lists/useLazyRenderedList';

import OptimisticDepositsListItem from './OptimisticDepositsListItem';

type Props = {
  items: Array<schemas['OptimismDeposit']>;
  isLoading?: boolean;
  resetKey?: string;
};

const OptimisticDepositsList = ({ items, isLoading, resetKey }: Props) => {
  const { cutRef, renderedItemsNum } = useLazyRenderedList({ list: items, isEnabled: !isLoading, resetKey });

  return (
    <>
      <Box>
        { items.slice(0, renderedItemsNum).map((item, index) => (
          <OptimisticDepositsListItem
            key={ `${ (item.l2_transaction_hash ?? '') + (isLoading ? index : '') }` }
            isLoading={ isLoading }
            item={ item }
          />
        )) }
      </Box>
      <Box ref={ cutRef } h={ 0 }/>
    </>
  );
};

export default OptimisticDepositsList;
