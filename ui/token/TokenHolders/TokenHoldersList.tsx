import { Box } from '@chakra-ui/react';
import React from 'react';

import type { TokenHolder, TokenInfo } from 'types/api/tokenInfo';

import TokenHoldersListItem from './TokenHoldersListItem';

interface Props {
  data: Array<TokenHolder>;
  token: TokenInfo;
}

const TokenHoldersList = ({ data, token }: Props) => {
  return (
    <Box>
      { data.map((item) => (
        <TokenHoldersListItem
          key={ item.address.hash }
          token={ token }
          holder={ item }
        />
      )) }
    </Box>
  );
};

export default TokenHoldersList;
