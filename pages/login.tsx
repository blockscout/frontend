import type { NextPage } from 'next';
import React from 'react';

import PageServer from 'lib/next/PageServer';
import Login from 'ui/pages/Login';

const LoginPage: NextPage = () => {
  return (
    <PageServer pathname="/login">
      <Login/>
    </PageServer>
  );
};

export default LoginPage;

export { getServerSideProps } from 'lib/next/getServerSideProps';
