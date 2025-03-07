import { Box, Text, useColorModeValue } from '@chakra-ui/react';
import type { FC } from 'react';
import React from 'react';

import type { NovesNft, NovesToken } from 'types/api/noves';

import { HEX_REGEXP } from 'lib/regexp';
import CopyToClipboard from 'ui/shared/CopyToClipboard';

interface Props {
  amount?: string;
  token: NovesToken | NovesNft | undefined;
}

const NovesTokenTooltipContent: FC<Props> = ({ token, amount }) => {
  const textColor = useColorModeValue('white', 'blackAlpha.900');

  if (!token) {
    return null;
  }

  const showTokenName = token.symbol !== token.name;
  const showTokenAddress = HEX_REGEXP.test(token.address);

  return (
    <Box color={ textColor } display="flex" flexDir="column" alignItems="center" gap={ 1 }>
      <Text as="p" color="inherit" fontWeight="600">
        <Text color="inherit" as="span">
          { amount }
        </Text>
        <Text color="inherit" as="span" ml={ 1 }>
          { token.symbol }
        </Text>
      </Text>

      { showTokenName && (
        <Text as="p" color="inherit" fontWeight="600" mt="6px">
          { token.name }
        </Text>
      ) }

      { showTokenAddress && (
        <Box display="flex" alignItems="center">
          <Text color="inherit" fontWeight="400">
            { token.address }
          </Text>
          <CopyToClipboard text={ token.address }/>
        </Box>
      ) }

    </Box>
  );
};

export default React.memo(NovesTokenTooltipContent);
