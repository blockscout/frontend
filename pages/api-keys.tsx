import React from 'react';
import type { NextPage } from 'next';
import Head from 'next/head'

import ApiKeys from 'ui/pages/ApiKeys';

const ApiKeysPage: NextPage = () => {
  return (
    <>
      <Head><title>API keys</title></Head>
      <ApiKeys/>
    </>
  );
}

export default ApiKeysPage
