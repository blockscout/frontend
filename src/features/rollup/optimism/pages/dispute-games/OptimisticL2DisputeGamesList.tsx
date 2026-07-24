// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box } from '@chakra-ui/react';
import React from 'react';

import type { schemas } from '@blockscout/api-types';

import useLazyRenderedList from 'src/shared/lists/useLazyRenderedList';

import OptimisticL2DisputeGamesListItem from './OptimisticL2DisputeGamesListItem';

type Props = {
  items: Array<schemas['OptimismGame']>;
  isLoading?: boolean;
  resetKey?: string;
};

const OptimisticL2DisputeGamesList = ({ items, isLoading, resetKey }: Props) => {
  const { cutRef, renderedItemsNum } = useLazyRenderedList({ list: items, isEnabled: !isLoading, resetKey });

  return (
    <>
      <Box>
        { items.slice(0, renderedItemsNum).map((item, index) => (
          <OptimisticL2DisputeGamesListItem
            key={ item.index + (isLoading ? String(index) : '') }
            item={ item }
            isLoading={ isLoading }
          />
        )) }
      </Box>
      <Box ref={ cutRef } h={ 0 }/>
    </>
  );
};

export default OptimisticL2DisputeGamesList;
