import { Box } from '@chakra-ui/react';
import React from 'react';

interface Props {
  children: React.ReactNode;
}

const PageContent = ({ children }: Props) => {
  return (
    <Box
      as="main"
      w="100%"
      paddingX={{ base: 4, lg: 12 }}
      paddingBottom={ 10 }
      paddingTop={{ base: '138px', lg: 0 }}
    >
      { children }
    </Box>
  );
};

export default PageContent;
