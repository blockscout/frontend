import { Center, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

import Page from 'ui/shared/Page/Page';

const App = () => {
  return (
    <Page wrapChildren={ false }>
      <Center as="main" bgColor={ useColorModeValue('blackAlpha.200', 'whiteAlpha.200') } h="100%" paddingTop={{ base: '138px', lg: 0 }}>
        3rd party app content
      </Center>
    </Page>
  );
};

export default App;
