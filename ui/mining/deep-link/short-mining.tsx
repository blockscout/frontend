import React, { useEffect } from 'react';
import { Box, Text, Flex } from '@chakra-ui/react';
import LinkExternal from '../../shared/LinkExternal';

const FixedComponent = () => {
  return (
    <div>
      <Box mb={4}>
        <Text color="gray.600">
          Note: For the short - term rental mode, the machines can be placed anywhere. However, the network upstream
          bandwidth of a single GPU machine needs to be at least 10 Mb. The machines participating in short - term
          rental mining must be installed with the Windows system. For detailed rules,
          check:https://orion.deeplink.cloud/shortterm
        </Text>
      </Box>
      <Flex direction="column" gap={6}>
        <Flex gap={4}>
          <Box
            w="24px"
            h="24px"
            borderRadius="full"
            bg="blue.500"
            color="white"
            display="flex"
            alignItems="center"
            justifyContent="center"
            flexShrink={0}
          >
            1
          </Box>
          <Text mb={2}>
            First, download the DeepLink PC - side software on a Windows computer with a GPU. The download link is:{' '}
            <LinkExternal href="https://deepbrainchain.github.io/DBC-Wiki/install-update-dbc-node/install-update-dbc/dbc-bare-metal-node.html">
              xxx
            </LinkExternal>
          </Text>
        </Flex>
        <Flex gap={4}>
          <Box
            w="24px"
            h="24px"
            borderRadius="full"
            bg="blue.500"
            color="white"
            display="flex"
            alignItems="center"
            justifyContent="center"
            flexShrink={0}
          >
            1
          </Box>

          <Text mb={2}>Create a wallet</Text>
        </Flex>
        <Flex gap={4}>
          <Box
            w="24px"
            h="24px"
            borderRadius="full"
            bg="blue.500"
            color="white"
            display="flex"
            alignItems="center"
            justifyContent="center"
            flexShrink={0}
          >
            1
          </Box>
          <Text mb={2}>
            Click on "Cloud Computer" -{'>'} "My Computer" -{'>'} "Add Machine"
          </Text>
        </Flex>
      </Flex>
    </div>
  );
};

export default FixedComponent;
