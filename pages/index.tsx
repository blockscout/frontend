import type { NextPage } from 'next';
import React from 'react';

import PageServer from 'lib/next/PageServer';
import Home from 'ui/pages/Home';

const HomePage: NextPage = () => {
  return (
    <PageServer pathname="/">
      <Home/>
    </PageServer>
  );
};

export default HomePage;

export { base as getServerSideProps } from 'lib/next/getServerSideProps';
