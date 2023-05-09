import { Box } from '@chakra-ui/react';
import React from 'react';

import type { TokenHolder, TokenInfo } from 'types/api/token';

import TokenHoldersListItem from './TokenHoldersListItem';

interface Props {
  data: Array<TokenHolder>;
  token: TokenInfo;
  isLoading?: boolean;
}

const TokenHoldersList = ({ data, token, isLoading }: Props) => {
  return (
    <Box>
      { data.map((item, index) => (
        <TokenHoldersListItem
          key={ item.address.hash + (isLoading ? index : '') }
          token={ token }
          holder={ item }
          isLoading={ isLoading }
        />
      )) }
    </Box>
  );
};

export default TokenHoldersList;
