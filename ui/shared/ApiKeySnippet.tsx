import { Box, HStack, Flex, Skeleton, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

import CopyToClipboard from 'ui/shared/CopyToClipboard';
import IconSvg from 'ui/shared/IconSvg';

interface Props {
  apiKey: string;
  name: string;
  isLoading?: boolean;
}

const ApiKeySnippet = ({ apiKey, name, isLoading }: Props) => {
  return (
    <HStack spacing={ 2 } alignItems="start">
      <IconSvg name="key" boxSize={ 6 } color={ useColorModeValue('gray.500', 'gray.400') } isLoading={ isLoading }/>
      <Box>
        <Flex alignItems={{ base: 'flex-start', lg: 'center' }}>
          <Skeleton isLoaded={ !isLoading } display="inline-block" fontWeight={ 600 } mr={ 1 }>
            <span>{ apiKey }</span>
          </Skeleton>
          <CopyToClipboard text={ apiKey } isLoading={ isLoading }/>
        </Flex>
        { name && (
          <Skeleton isLoaded={ !isLoading } display="inline-block" fontSize="sm" color="text_secondary" mt={ 1 }>
            <span>{ name }</span>
          </Skeleton>
        ) }
      </Box>
    </HStack>
  );
};

export default React.memo(ApiKeySnippet);
