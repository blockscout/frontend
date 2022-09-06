import { Box, HStack, Icon, Flex, Text, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

import keyIcon from 'icons/key.svg';
import CopyToClipboard from 'ui/shared/CopyToClipboard';

interface Props {
  apiKey: string;
  name: string;
}

const ApiKeySnippet = ({ apiKey, name }: Props) => {
  return (
    <HStack spacing={ 2 } alignItems="start">
      <Icon as={ keyIcon } boxSize={ 6 } color={ useColorModeValue('gray.500', 'gray.400') }/>
      <Box>
        <Flex alignItems={{ base: 'flex-start', lg: 'center' }}>
          <Text fontSize="md" lineHeight={ 6 } fontWeight={ 600 } mr={ 1 }>{ apiKey }</Text>
          <CopyToClipboard text={ apiKey }/>
        </Flex>
        { name && <Text fontSize="sm" variant="secondary" mt={ 1 }>{ name }</Text> }
      </Box>
    </HStack>
  );
};

export default React.memo(ApiKeySnippet);
