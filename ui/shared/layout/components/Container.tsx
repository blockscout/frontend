import { Box } from '@chakra-ui/react';
import React from 'react';

interface Props {
  children: React.ReactNode;
}

const Container = ({ children }: Props) => {
  return (
    <Box minWidth={{ base: '100vw', lg: 'fit-content' }}>
      { children }
    </Box>
  );
};

export default React.memo(Container);
