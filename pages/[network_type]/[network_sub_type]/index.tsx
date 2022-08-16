import { Center } from '@chakra-ui/react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import React from 'react';

import Page from 'ui/shared/Page/Page';

const Home: NextPage = () => {
  const router = useRouter();

  return (
    <Page>
      <Center h="100%">
        home page for { router.query.network_type } { router.query.network_sub_type } network
      </Center>
    </Page>
  );
};

export default Home;
