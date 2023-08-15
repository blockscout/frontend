import { Box } from '@chakra-ui/react';
import React from 'react';

interface Props {
  children: React.ReactNode;
}

const Content = ({ children }: Props) => {
  return (
    <Box pt={{ base: 0, lg: '52px' }}>
      { children }
    </Box>
  );
};

export default React.memo(Content);
