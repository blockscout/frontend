import { Box } from '@chakra-ui/react';
import React from 'react';

import type { InternalTransaction } from 'types/api/internalTransaction';

import InternalTxsListItem from './InternalTxsListItem';

type Props = {
  data: Array<InternalTransaction>;
  currentAddress?: string;
  isLoading?: boolean;
};

const InternalTxsList = ({ data, currentAddress, isLoading }: Props) => {
  return (
    <Box>
      { data.map((item, index) => (
        <InternalTxsListItem
          key={ item.transaction_hash + '_' + index }
          { ...item }
          currentAddress={ currentAddress }
          isLoading={ isLoading }
        />
      )) }
    </Box>
  );
};

export default InternalTxsList;
