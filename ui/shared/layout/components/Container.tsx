import { Box, chakra } from '@chakra-ui/react';
import React from 'react';

interface Props {
  children: React.ReactNode;
  className?: string;
}

const Container = ({ children, className }: Props) => {
  return (
    <Box
      className={ className }
      minWidth={{ base: '100%', lg: 'fit-content' }}
      m="0 auto"
      bgColor="black"
    >
      { children }
    </Box>
  );
};

export default React.memo(chakra(Container));
