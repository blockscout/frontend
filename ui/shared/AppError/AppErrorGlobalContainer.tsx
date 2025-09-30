import { Box } from '@chakra-ui/react';
import React from 'react';

import { useColorModeValue } from 'toolkit/chakra/color-mode';

interface Props {
  children: React.ReactNode;
}

const AppErrorGlobalContainer = ({ children }: Props) => {
  const bgColor = useColorModeValue('white', 'black');

  return <Box bgColor={ bgColor }>{ children }</Box>;
};

export default React.memo(AppErrorGlobalContainer);
