// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box } from '@chakra-ui/react';
import React from 'react';

import type { schemas } from '@blockscout/api-types';

import { useMultichainContext } from 'src/features/multichain/context';

import InternalTxsListItem from './InternalTxsListItem';

interface Props {
  data: Array<schemas['InternalTransaction']>;
  currentAddress?: string;
  isLoading?: boolean;
  showBlockInfo?: boolean;
};

const InternalTxsList = ({ data, currentAddress, isLoading, showBlockInfo = true }: Props) => {
  const multichainContext = useMultichainContext();
  const chainData = multichainContext?.chain;

  return (
    <Box>
      { data.map((item, index) => (
        <InternalTxsListItem
          key={ item.transaction_hash + '_' + index }
          data={ item }
          currentAddress={ currentAddress }
          isLoading={ isLoading }
          showBlockInfo={ showBlockInfo }
          chainData={ chainData }
        />
      )) }
    </Box>
  );
};

export default InternalTxsList;
