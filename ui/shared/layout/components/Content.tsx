import { Box, chakra } from '@chakra-ui/react';
import React from 'react';

interface Props {
  className?: string;
  children: React.ReactNode;
}

const Content = ({ children, className }: Props) => {
  return (
    <Box id='CONTENT' pt={{ base: '12px' }} as="main" className={ className }>
      { children }
    </Box>
  );
};

export default React.memo(chakra(Content));
