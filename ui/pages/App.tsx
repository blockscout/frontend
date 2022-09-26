import { Center, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

import Page from 'ui/shared/Page/Page';

const App = () => {
  return (
    <Page wrapChildren={ false } rowGap={ 10 }>
      <Center bgColor={ useColorModeValue('blackAlpha.200', 'whiteAlpha.200') } h="100%" w="100%" flexGrow={ 1 }>
        3rd party app content
      </Center>
    </Page>
  );
};

export default App;
