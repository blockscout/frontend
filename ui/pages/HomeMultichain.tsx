import { Box } from '@chakra-ui/react';
import React from 'react';

import HeroBanner from 'ui/home/HeroBanner';

const HomeMultichain = () => {
  return (
    <Box as="main">
      <HeroBanner/>
      <Box mt={ 3 }>
        Coming soon 🔜
      </Box>
    </Box>
  );
};

export default React.memo(HomeMultichain);
