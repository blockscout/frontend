/* eslint-disable no-console */
import {
  WrapItem,
  Wrap,
  Box,
  useToast,
  Text,
  Flex,
} from '@chakra-ui/react';
import React from 'react';

import IconSvg from 'ui/shared/IconSvg';

const PositionExample = (props: { address: string }) => {
  const toast = useToast();
  toast({
    position: 'top',
    isClosable: false,
    duration: 300000,
    render: () => (
      <Box
        padding="10px 48px"
        bg="#FFFF"
        border="1px solid rgba(0, 0, 0, 0.06)"
        borderRadius="32px"
        width="auto"
      >
        <Flex alignItems="center">
          <IconSvg name="copy-toast" width="16px" height="16px" marginRight="4px"/>
          <Text fontWeight="700"
            fontSize="14px"
            color="#000000">Copy successfully</Text>
        </Flex>
      </Box>
    ),
  });
  const elInput = document.createElement('input');
  elInput.value = props.address;
  document.body.appendChild(elInput);
  elInput.select();
  document.execCommand('Copy');
  elInput.remove();

  return (
    <Wrap>
      <WrapItem></WrapItem>
    </Wrap>
  );
};

export default PositionExample;
