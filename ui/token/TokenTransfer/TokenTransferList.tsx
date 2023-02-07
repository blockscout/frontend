import { Box } from '@chakra-ui/react';
import React from 'react';

import type { TokenTransfer } from 'types/api/tokenTransfer';

import TokenTransferListItem from 'ui/token/TokenTransfer/TokenTransferListItem';

interface Props {
  data: Array<TokenTransfer>;
}

const TokenTransferList = ({ data }: Props) => {
  return (
    <Box>
      { data.map((item, index) => (
        <TokenTransferListItem
          key={ index }
          { ...item }
        />
      )) }
    </Box>
  );
};

export default TokenTransferList;
