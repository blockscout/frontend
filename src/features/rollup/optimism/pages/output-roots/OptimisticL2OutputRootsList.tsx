// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box } from '@chakra-ui/react';
import React from 'react';

import type { schemas } from '@blockscout/api-types';

import useLazyRenderedList from 'src/shared/lists/useLazyRenderedList';

import OptimisticL2OutputRootsListItem from './OptimisticL2OutputRootsListItem';

type Props = {
  items: Array<schemas['OptimismOutputRoot']>;
  isLoading?: boolean;
  resetKey?: string;
};

const OptimisticL2OutputRootsList = ({ items, isLoading, resetKey }: Props) => {
  const { cutRef, renderedItemsNum } = useLazyRenderedList({ list: items, isEnabled: !isLoading, resetKey });

  return (
    <>
      <Box>
        { items.slice(0, renderedItemsNum).map((item, index) => (
          <OptimisticL2OutputRootsListItem
            key={ item.l2_output_index + (isLoading ? String(index) : '') }
            item={ item }
            isLoading={ isLoading }
          />
        )) }
      </Box>
      <Box ref={ cutRef } h={ 0 }/>
    </>
  );
};

export default OptimisticL2OutputRootsList;
