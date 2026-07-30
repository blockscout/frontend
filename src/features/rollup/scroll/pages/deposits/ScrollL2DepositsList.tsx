// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box } from '@chakra-ui/react';
import React from 'react';

import type { schemas } from '@blockscout/api-types';

import useLazyRenderedList from 'src/shared/lists/useLazyRenderedList';

import ScrollL2DepositsListItem from './ScrollL2DepositsListItem';

type Props = {
  items: Array<schemas['ScrollBridge']>;
  isLoading?: boolean;
  resetKey?: string;
};

const ScrollL2DepositsList = ({ items, isLoading, resetKey }: Props) => {
  const { cutRef, renderedItemsNum } = useLazyRenderedList({ list: items, isEnabled: !isLoading, resetKey });

  return (
    <>
      <Box>
        { items.slice(0, renderedItemsNum).map((item, index) => (
          <ScrollL2DepositsListItem
            key={ String(item.id) + (isLoading ? index : '') }
            isLoading={ isLoading }
            item={ item }
          />
        )) }
      </Box>
      <Box ref={ cutRef } h={ 0 }/>
    </>
  );
};

export default ScrollL2DepositsList;
