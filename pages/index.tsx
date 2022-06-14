import React from 'react';
import type { NextPage } from 'next';
import { Center, FormControl, Input, FormLabel } from '@chakra-ui/react';
import Page from '../components/Page/Page';

const Home: NextPage = () => {
  return (
    <Page>
      <Center h="100%">
        <FormControl variant="floating" id="address" isRequired>
          { /* Placeholder should be present */ }
          <Input placeholder=" "/>
          { /* It is important that the Label comes after the Control due to css selectors */ }
          <FormLabel>Address</FormLabel>
        </FormControl>
      </Center>
    </Page>
  );
};

export default Home
