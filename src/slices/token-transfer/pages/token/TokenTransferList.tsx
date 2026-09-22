// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box } from '@chakra-ui/react';
import React from 'react';

import type { schemas } from '@blockscout/api-types';

import TokenTransferListItem from 'src/slices/token-transfer/pages/token/TokenTransferListItem';
import { getTokenTransferKey } from 'src/slices/token-transfer/utils/get-token-transfer-key';

import { useMultichainContext } from 'src/features/multichain/context';

import useLazyRenderedList from 'src/shared/lists/useLazyRenderedList';

interface Props {
  data: Array<schemas['TokenTransfer']>;
  tokenId?: string;
  instance?: schemas['TokenInstance'];
  isLoading?: boolean;
  resetKey?: string;
}

const TokenTransferList = ({ data, tokenId, instance, isLoading, resetKey }: Props) => {
  const multichainContext = useMultichainContext();
  const chainData = multichainContext?.chain;
  const { cutRef, renderedItemsNum } = useLazyRenderedList({ list: data, isEnabled: !isLoading, resetKey });

  return (
    <>
      <Box>
        { data.slice(0, renderedItemsNum).map((item, index) => (
          <TokenTransferListItem
            key={ getTokenTransferKey(item) + (isLoading ? index : '') }
            data={ item }
            tokenId={ tokenId }
            instance={ instance }
            isLoading={ isLoading }
            chainData={ chainData }
          />
        )) }
      </Box>
      <Box ref={ cutRef } h={ 0 }/>
    </>
  );
};

export default React.memo(TokenTransferList);
