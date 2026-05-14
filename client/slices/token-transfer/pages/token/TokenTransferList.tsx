// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box } from '@chakra-ui/react';
import React from 'react';

import type { TokenTransfer } from 'client/slices/token-transfer/types/api';
import type { TokenInstance } from 'client/slices/token/types/api';

import TokenTransferListItem from 'client/slices/token-transfer/pages/token/TokenTransferListItem';

import { useMultichainContext } from 'lib/contexts/multichain';

interface Props {
  data: Array<TokenTransfer>;
  tokenId?: string;
  instance?: TokenInstance;
  isLoading?: boolean;
}

const TokenTransferList = ({ data, tokenId, instance, isLoading }: Props) => {
  const multichainContext = useMultichainContext();
  const chainData = multichainContext?.chain;

  return (
    <Box>
      { data.map((item, index) => (
        <TokenTransferListItem
          key={ item.transaction_hash + item.block_hash + item.log_index + '_' + index }
          { ...item }
          tokenId={ tokenId }
          instance={ instance }
          isLoading={ isLoading }
          chainData={ chainData }
        />
      )) }
    </Box>
  );
};

export default React.memo(TokenTransferList);
