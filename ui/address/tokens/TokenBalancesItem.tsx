import { Box, Flex, Skeleton, Text, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

import IconSvg from 'ui/shared/IconSvg';

const TokenBalancesItem = ({ name, value, isLoading }: {name: string; value: string; isLoading: boolean }) => {

  const bgColor = useColorModeValue('blackAlpha.50', 'whiteAlpha.50');

  return (
    <Flex p={ 5 } bgColor={ bgColor } borderRadius="16px" alignItems="center">
      <IconSvg name="wallet" boxSize="30px" mr={ 3 }/>
      <Box>
        <Text variant="secondary" fontSize="xs">{ name }</Text>
        <Skeleton isLoaded={ !isLoading } fontWeight="500">{ value }</Skeleton>
      </Box>
    </Flex>
  );
};

export default React.memo(TokenBalancesItem);
