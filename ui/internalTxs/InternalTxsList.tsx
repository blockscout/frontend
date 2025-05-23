import { Box } from '@chakra-ui/react';
import React from 'react';

import type { InternalTransaction } from 'types/api/internalTransaction';

import InternalTxsListItem from './InternalTxsListItem';

type Props = {
  data: Array<InternalTransaction>;
  currentAddress?: string;
  isLoading?: boolean;
  showBlockInfo?: boolean;
};

const InternalTxsList = ({ data, currentAddress, isLoading, showBlockInfo = true }: Props) => {
  return (
    <Box>
      { data.map((item, index) => (
        <InternalTxsListItem
          key={ item.transaction_hash + '_' + index }
          { ...item }
          currentAddress={ currentAddress }
          isLoading={ isLoading }
          showBlockInfo={ showBlockInfo }
        />
      )) }
    </Box>
  );
};

export default InternalTxsList;
