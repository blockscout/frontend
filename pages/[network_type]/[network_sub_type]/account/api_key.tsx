import type { NextPage, GetStaticPaths } from 'next';
import Head from 'next/head';
import React from 'react';

import getAvailablePaths from 'lib/networks/getAvailablePaths';
import ApiKeys from 'ui/pages/ApiKeys';

const ApiKeysPage: NextPage = () => {
  return (
    <>
      <Head><title>API keys</title></Head>
      <ApiKeys/>
    </>
  );
};

export default ApiKeysPage;

export const getStaticPaths: GetStaticPaths = async() => {
  return { paths: getAvailablePaths(), fallback: false };
};

export const getStaticProps = async() => {
  return {
    props: {},
  };
};
