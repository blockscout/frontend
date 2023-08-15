import { Flex } from '@chakra-ui/react';
import React from 'react';

interface Props {
  children: React.ReactNode;
}

const MainArea = ({ children }: Props) => {
  return (
    <Flex w="100%" minH="100vh" alignItems="stretch">
      { children }
    </Flex>
  );
};

export default React.memo(MainArea);
