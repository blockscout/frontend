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
      { data.map((item, index) => (
        <TokenTransferListItem
          key={ index }
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
