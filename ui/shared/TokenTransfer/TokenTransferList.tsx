import { Box } from '@chakra-ui/react';
import React from 'react';

import type { TokenTransfer } from 'types/api/tokenTransfer';

import TokenTransferListItem from 'ui/shared/TokenTransfer/TokenTransferListItem';

interface Props {
  data: Array<TokenTransfer>;
  baseAddress?: string;
  showTxInfo?: boolean;
}

const TokenTransferList = ({ data, baseAddress, showTxInfo }: Props) => {
  return (
    <Box>
      { data.map((item, index) => <TokenTransferListItem key={ index } { ...item } baseAddress={ baseAddress } showTxInfo={ showTxInfo }/>) }
    </Box>
  );
};

export default TokenTransferList;
