import { Box, chakra, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

interface Props {
  children: React.ReactNode;
  className?: string;
}

const Container = ({ children, className }: Props) => {
  const bgColor = useColorModeValue('white', 'black');

  return (
    <Box
      className={ className }
      minWidth={{ base: '100vw', lg: 'fit-content' }}
      m="0 auto"
      bgColor={ bgColor }
    >
      { children }
    </Box>
  );
};

export default React.memo(chakra(Container));
