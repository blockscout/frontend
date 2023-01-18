import { Box, Flex, Icon, Text, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

import walletIcon from 'icons/wallet.svg';

const TokenBalancesItem = ({ name, value }: {name: string; value: string }) => {

  const bgColor = useColorModeValue('blackAlpha.50', 'whiteAlpha.50');

  return (
    <Flex p={ 5 } bgColor={ bgColor } borderRadius="16px" alignItems="center">
      <Icon as={ walletIcon } boxSize="30px" mr={ 3 }/>
      <Box>
        <Text variant="secondary" fontSize="xs">{ name }</Text>
        <Text fontWeight="500">{ value }</Text>
      </Box>
    </Flex>
  );
};

export default React.memo(TokenBalancesItem);
