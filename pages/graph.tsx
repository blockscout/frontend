import type { NextPage } from 'next';
import Head from 'next/head';
import React from 'react';

import Graph from 'ui/pages/Graph';

const GraphPage: NextPage = () => {
  return (
    <>
      <Head><title>Graph Page</title></Head>
      <Graph/>
    </>
  );
};

export default GraphPage;

export { getServerSideProps } from 'lib/next/getServerSideProps';
