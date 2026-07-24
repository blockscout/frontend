// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box } from '@chakra-ui/react';
import React from 'react';

import type * as contractsInfo from '@blockscout/contracts-info-types';

import useLazyRenderedList from 'src/shared/lists/useLazyRenderedList';

import PoolsListItem from './PoolsListItem';

interface Props {
  items: Array<contractsInfo.Pool>;
  isLoading?: boolean;
  resetKey?: string;
}

const PoolsList = ({ items, isLoading, resetKey }: Props) => {
  const { cutRef, renderedItemsNum } = useLazyRenderedList({ list: items, isEnabled: !isLoading, resetKey });

  return (
    <>
      <Box>
        { items.slice(0, renderedItemsNum).map((item, index) => (
          <PoolsListItem
            key={ item.pool_id + (isLoading ? index : '') }
            isLoading={ isLoading }
            item={ item }
          />
        )) }
      </Box>
      <Box ref={ cutRef } h={ 0 }/>
    </>
  );
};

export default React.memo(PoolsList);
