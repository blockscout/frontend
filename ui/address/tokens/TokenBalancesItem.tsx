import { Box, Flex, Text } from '@chakra-ui/react';
import React from 'react';

import { Skeleton } from 'toolkit/chakra/skeleton';

type Props = {
  name: string;
  value: string;
  icon: React.ReactNode;
  valueSecondary?: string;
  isLoading: boolean;
};

const TokenBalancesItem = ({ name, icon, value, valueSecondary, isLoading }: Props) => {

  return (
    <Box px="12px" py="10px" bgColor={{ _light: 'blackAlpha.50', _dark: 'whiteAlpha.50' }} borderRadius="base">
      <Text color="text.secondary" textStyle="xs" fontWeight={ 500 } mb={ 1 }>{ name }</Text>
      <Flex alignItems="center">
        { icon }
        <Skeleton loading={ isLoading } fontWeight="500" whiteSpace="pre-wrap" wordBreak="break-word" display="flex" ml={ 2 }>
          { value }
          { Boolean(valueSecondary) && <Text color="text.secondary"> ({ valueSecondary })</Text> }
        </Skeleton>
      </Flex>
    </Box>
  );
};

export default React.memo(TokenBalancesItem);
