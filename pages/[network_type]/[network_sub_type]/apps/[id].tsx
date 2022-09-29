import type { NextPage } from 'next';
import Head from 'next/head';
import React from 'react';

import App from 'ui/pages/App';

const AppPage: NextPage = () => {
  return (
    <>
      <Head><title>App Card Page</title></Head>
      <App/>
    </>
  );
};

export default AppPage;

export { getStaticPaths } from 'lib/next/apps/getStaticPaths';
export { getStaticProps } from 'lib/next/getStaticProps';
