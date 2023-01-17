import { Box } from '@chakra-ui/react';
import React from 'react';

import type { TokenTransfer } from 'types/api/tokenTransfer';

import TokenTransferListItem from 'ui/shared/TokenTransfer/TokenTransferListItem';

interface Props {
  data: Array<TokenTransfer>;
  baseAddress?: string;
  showTxInfo?: boolean;
  enableTimeIncrement?: boolean;
}

const TokenTransferList = ({ data, baseAddress, showTxInfo, enableTimeIncrement }: Props) => {
  return (
    <Box>
      { data.map((item) => (
        <TokenTransferListItem
          key={ item.tx_hash + item.block_hash + item.log_index }
          { ...item }
          baseAddress={ baseAddress }
          showTxInfo={ showTxInfo }
          enableTimeIncrement={ enableTimeIncrement }
        />
      )) }
    </Box>
  );
};

export default TokenTransferList;
