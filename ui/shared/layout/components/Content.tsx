import { Box } from '@chakra-ui/react';
import React from 'react';

interface Props {
  children: React.ReactNode;
}

const Content = ({ children }: Props) => {
  return (
    <div className="bg-">
      <Box pt={{ base: 0, lg: '20px' }} as="main">
        { children }
      </Box>
    </div>
  );
};

export default React.memo(Content);
