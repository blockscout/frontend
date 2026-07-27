// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box } from '@chakra-ui/react';
import React from 'react';

import type { schemas } from '@blockscout/api-types';

import useLazyRenderedList from 'src/shared/lists/useLazyRenderedList';

import type { MessagesDirection } from './ArbitrumL2Messages';
import ArbitrumL2MessagesListItem from './ArbitrumL2MessagesListItem';

type Props = {
  items: Array<schemas['ArbitrumMessage']>;
  direction: MessagesDirection;
  isLoading?: boolean;
  resetKey?: string;
};

const ArbitrumL2MessagesList = ({ items, direction, isLoading, resetKey }: Props) => {
  const { cutRef, renderedItemsNum } = useLazyRenderedList({ list: items, isEnabled: !isLoading, resetKey });

  return (
    <>
      <Box>
        { items.slice(0, renderedItemsNum).map((item, index) => (
          <ArbitrumL2MessagesListItem
            key={ String(item.id) + (isLoading ? index : '') }
            isLoading={ isLoading }
            item={ item }
            direction={ direction }
          />
        )) }
      </Box>
      <Box ref={ cutRef } h={ 0 }/>
    </>
  );
};

export default ArbitrumL2MessagesList;
