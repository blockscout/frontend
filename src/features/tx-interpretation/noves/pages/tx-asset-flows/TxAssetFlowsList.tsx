// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box } from '@chakra-ui/react';
import React from 'react';

import useLazyRenderedList from 'src/shared/lists/useLazyRenderedList';

import type { NovesFlowViewItem } from '../../utils/generateFlowViewData';
import TxAssetFlowsListItem from './TxAssetFlowsListItem';

interface Props {
  items: Array<NovesFlowViewItem>;
  isPlaceholderData?: boolean;
  resetKey?: string;
}

const TxAssetFlowsList = ({ items, isPlaceholderData, resetKey }: Props) => {
  const { cutRef, renderedItemsNum } = useLazyRenderedList({ list: items, isEnabled: !isPlaceholderData, resetKey });

  return (
    <Box>
      { items.slice(0, renderedItemsNum).map((item, i) => (
        <TxAssetFlowsListItem
          key={ `${ i }-${ item.accountAddress }` }
          item={ item }
          isPlaceholderData={ Boolean(isPlaceholderData) }
        />
      )) }
      <Box ref={ cutRef } h={ 0 }/>
    </Box>
  );
};

export default React.memo(TxAssetFlowsList);
