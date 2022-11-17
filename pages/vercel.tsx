import type { NextPage } from 'next';
import Head from 'next/head';
import React from 'react';

import Vercel from 'ui/pages/Vercel';

const VercelPage: NextPage = () => {
  return (
    <>
      <Head><title>Vercel Page</title></Head>
      <Vercel/>
    </>
  );
};

export default VercelPage;

export { getServerSideProps } from 'lib/next/getServerSideProps';
