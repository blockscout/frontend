import { Flex } from '@chakra-ui/react';
import React from 'react';

interface Props {
  children: React.ReactNode;
}

const MainArea = ({ children }: Props) => {
  return (
    <Flex w="100%" minH="calc(100vh - 36px)" alignItems="stretch">
      { children }
    </Flex>
  );
};

export default React.memo(MainArea);
