// SPDX-License-Identifier: LicenseRef-Blockscout

// TODO: remove this component once tables in mobile are finalized
import { Box } from '@chakra-ui/react';
import React from 'react';

import type { schemas } from '@blockscout/api-types';

import { useMultichainContext } from 'src/features/multichain/context';

import useLazyRenderedList from 'src/shared/lists/useLazyRenderedList';

import TokenTransferListItem from './TokenTransferListItem';

interface Props {
  data: Array<schemas['TokenTransfer']>;
  baseAddress?: string;
  showTxInfo?: boolean;
  enableTimeIncrement?: boolean;
  isLoading?: boolean;
  resetKey?: string;
}

const TokenTransferList = ({ data, baseAddress, showTxInfo, enableTimeIncrement, isLoading, resetKey }: Props) => {
  const multichainContext = useMultichainContext();
  const chainData = multichainContext?.chain;
  const { cutRef, renderedItemsNum } = useLazyRenderedList({ list: data, isEnabled: !isLoading, resetKey });

  return (
    <Box>
      { data.slice(0, renderedItemsNum).map((item, index) => (
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
      <Box ref={ cutRef } h={ 0 }/>
    </Box>
  );
};

export default React.memo(TokenTransferList);
