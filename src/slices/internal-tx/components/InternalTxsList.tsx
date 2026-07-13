// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box } from '@chakra-ui/react';
import React from 'react';

import type { schemas } from '@blockscout/api-types';

import { useMultichainContext } from 'src/features/multichain/context';

import useLazyRenderedList from 'src/shared/lists/useLazyRenderedList';

import InternalTxsListItem from './InternalTxsListItem';

interface Props {
  data: Array<schemas['InternalTransaction']>;
  currentAddress?: string;
  isLoading?: boolean;
  showBlockInfo?: boolean;
  resetKey?: string;
};

const InternalTxsList = ({ data, currentAddress, isLoading, showBlockInfo = true, resetKey }: Props) => {
  const multichainContext = useMultichainContext();
  const chainData = multichainContext?.chain;
  const { cutRef, renderedItemsNum } = useLazyRenderedList({ list: data, isEnabled: !isLoading, resetKey });

  return (
    <Box>
      { data.slice(0, renderedItemsNum).map((item, index) => (
        <InternalTxsListItem
          key={ item.transaction_hash + '_' + index }
          data={ item }
          currentAddress={ currentAddress }
          isLoading={ isLoading }
          showBlockInfo={ showBlockInfo }
          chainData={ chainData }
        />
      )) }
      <Box ref={ cutRef } h={ 0 }/>
    </Box>
  );
};

export default InternalTxsList;
