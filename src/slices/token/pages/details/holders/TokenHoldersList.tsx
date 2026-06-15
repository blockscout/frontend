// SPDX-License-Identifier: LicenseRef-Blockscout

import { Box } from '@chakra-ui/react';
import React from 'react';

import type { schemas } from '@blockscout/api-types';

import TokenHoldersListItem from './TokenHoldersListItem';

interface Props {
  data: Array<schemas['TokenHolderResponse']>;
  token: schemas['Token'];
  isLoading?: boolean;
}

const TokenHoldersList = ({ data, token, isLoading }: Props) => {
  return (
    <Box>
      { data.map((item, index) => {
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
    </Box>
  );
};

export default TokenHoldersList;
