// SPDX-License-Identifier: LicenseRef-Blockscout

// TODO: remove this component once tables in mobile are finalized
import { Box } from '@chakra-ui/react';
import React from 'react';

import type { schemas } from '@blockscout/api-types';

import { useMultichainContext } from 'src/features/multichain/context';

import TokenTransferListItem from './TokenTransferListItem';

interface Props {
  data: Array<schemas['TokenTransfer']>;
  baseAddress?: string;
  showTxInfo?: boolean;
  enableTimeIncrement?: boolean;
  isLoading?: boolean;
}

const TokenTransferList = ({ data, baseAddress, showTxInfo, enableTimeIncrement, isLoading }: Props) => {
  const multichainContext = useMultichainContext();
  const chainData = multichainContext?.chain;

  return (
    <Box>
      { data.map((item, index) => (
        <TokenTransferListItem
          key={ item.transaction_hash + item.block_hash + item.log_index + (isLoading ? index : '') }
          data={ item }
          baseAddress={ baseAddress }
          showTxInfo={ showTxInfo }
          enableTimeIncrement={ enableTimeIncrement }
          isLoading={ isLoading }
          chainData={ chainData }
        />
      )) }
    </Box>
  );
};

export default React.memo(TokenTransferList);
