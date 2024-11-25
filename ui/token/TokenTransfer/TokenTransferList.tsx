import { Box } from '@chakra-ui/react';
import React from 'react';

import type { TokenTransfer } from 'types/api/tokenTransfer';

import TokenTransferListItem from 'ui/token/TokenTransfer/TokenTransferListItem';

interface Props {
  data: Array<TokenTransfer>;
  tokenId?: string;
  isLoading?: boolean;
}

const TokenTransferList = ({ data, tokenId, isLoading }: Props) => {
  return (
    <Box>
      { data.map((item, index) => (
        <TokenTransferListItem
          key={ item.transaction_hash + item.block_hash + item.log_index + '_' + index }
          { ...item }
          tokenId={ tokenId }
          isLoading={ isLoading }
        />
      )) }
    </Box>
  );
};

export default React.memo(TokenTransferList);
