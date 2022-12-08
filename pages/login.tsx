import type { NextPage } from 'next';
import Head from 'next/head';
import React from 'react';

import Login from 'ui/pages/Login';

const LoginPage: NextPage = () => {
  return (
    <>
      <Head><title>Login Page</title></Head>
      <Login/>
    </>
  );
};

export default LoginPage;

export { getServerSideProps } from 'lib/next/getServerSideProps';
