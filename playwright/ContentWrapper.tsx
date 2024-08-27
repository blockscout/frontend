import { Box, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

interface Props {
  children?: React.ReactNode;
}

const ContentWrapper = ({ children }: Props) => {
  const bgColor = useColorModeValue('white', 'black');
  return <Box bgColor={ bgColor }>{ children }</Box>;
};

export default React.memo(ContentWrapper);
