import { Box, Flex, Text, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

type Props = {
  name: string;
  total: string;
  new24: string;
}

const VerifiedContractsCountersItem = ({ name, total, new24 }: Props) => {
  const itemBgColor = useColorModeValue('blue.50', 'blue.800');
  return (
    <Box
      w={{ base: '100%', lg: 'calc((100% - 12px)/2)' }}
      borderRadius="12px"
      backgroundColor={ itemBgColor }
      p={ 3 }
    >
      <Text variant="secondary" fontSize="xs">{ name }</Text>
      <Flex alignItems="baseline">
        <Text fontWeight={ 600 } mr={ 2 } fontSize="lg">{ Number(total).toLocaleString() }</Text>
        { Number(new24) > 0 && (
          <>
            <Text fontWeight={ 600 } mr={ 1 } fontSize="lg" color="green.500">+{ Number(new24).toLocaleString() }</Text>
            <Text variant="secondary" fontSize="sm">(24h)</Text>
          </>
        ) }
      </Flex>
    </Box>
  );
};

export default VerifiedContractsCountersItem;
