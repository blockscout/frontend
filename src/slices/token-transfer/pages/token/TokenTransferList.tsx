// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box } from '@chakra-ui/react';
import React from 'react';

import type { schemas } from '@blockscout/api-types';

import TokenTransferListItem from 'src/slices/token-transfer/pages/token/TokenTransferListItem';

import { useMultichainContext } from 'src/features/multichain/context';

interface Props {
  data: Array<schemas['TokenTransfer']>;
  tokenId?: string;
  instance?: schemas['TokenInstance'];
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
          data={ item }
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
