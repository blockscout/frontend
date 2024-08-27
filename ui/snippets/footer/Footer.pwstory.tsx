import { Box, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

import Footer from './Footer';

const FooterPwStory = () => {
  const bgColor = useColorModeValue('white', 'black');
  return <Box bgColor={ bgColor }><Footer/></Box>;
};

export default React.memo(FooterPwStory);
