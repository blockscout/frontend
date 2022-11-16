import type { NextPage } from 'next';
import Head from 'next/head';
import React from 'react';

import Home from 'ui/pages/Home';

const HomePage: NextPage = () => {
  return (
    <>
      <Head><title>Home Page</title></Head>
      <Home/>
    </>
  );
};

export default HomePage;

export { getServerSideProps } from 'lib/next/getServerSideProps';
