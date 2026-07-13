// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box } from '@chakra-ui/react';
import React from 'react';

import type { schemas } from '@blockscout/api-types';

import useLazyRenderedList from 'src/shared/lists/useLazyRenderedList';

import TokenHoldersListItem from './TokenHoldersListItem';

interface Props {
  data: Array<schemas['TokenHolderResponse']>;
  token: schemas['Token'];
  isLoading?: boolean;
  resetKey?: string;
}

const TokenHoldersList = ({ data, token, isLoading, resetKey }: Props) => {
  const { cutRef, renderedItemsNum } = useLazyRenderedList({ list: data, isEnabled: !isLoading, resetKey });

  return (
    <Box>
      { data.slice(0, renderedItemsNum).map((item, index) => {
        const tokenId = 'token_id' in item ? item.token_id : null;
        return (
          <TokenHoldersListItem
            key={ item.address.hash + tokenId + (isLoading ? index : '') }
            token={ token }
            holder={ item }
            isLoading={ isLoading }
          />
        );
      }) }
      <Box ref={ cutRef } h={ 0 }/>
    </Box>
  );
};

export default TokenHoldersList;
