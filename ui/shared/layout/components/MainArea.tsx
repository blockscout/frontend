import { Flex, chakra } from '@chakra-ui/react';
import React from 'react';

interface Props {
  children: React.ReactNode;
  className?: string;
}

const MainArea = ({ children, className }: Props) => {
  return (
    <Flex className={ className } w="100%" minH="calc(100vh - 36px)" alignItems="stretch">
      { children }
    </Flex>
  );
};

export default React.memo(chakra(MainArea));
