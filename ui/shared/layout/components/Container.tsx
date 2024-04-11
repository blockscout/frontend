import { Box } from '@chakra-ui/react';
import React from 'react';

interface Props {
  children: React.ReactNode;
}

const Container = ({ children }: Props) => {
  return (
    <Box minWidth={{ base: '100vw', lg: 'fit-content' }} bgImage="url('https://i.pinimg.com/originals/5e/32/48/5e3248615362b6381406b5359ade36e0.jpg')">
      { children }
    </Box>
  );
};

export default React.memo(Container);
