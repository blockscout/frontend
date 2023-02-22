import { Box } from '@chakra-ui/react';
import React from 'react';

import type { TokenTransfer } from 'types/api/tokenTransfer';

import TokenTransferListItem from 'ui/token/TokenTransfer/TokenTransferListItem';

interface Props {
  data: Array<TokenTransfer>;
  tokenId?: string;
}

const TokenTransferList = ({ data, tokenId }: Props) => {
  return (
    <Box>
      { data.map((item, index) => (
        <TokenTransferListItem
          key={ index }
          { ...item }
          tokenId={ tokenId }
        />
      )) }
    </Box>
  );
};

export default React.memo(TokenTransferList);
