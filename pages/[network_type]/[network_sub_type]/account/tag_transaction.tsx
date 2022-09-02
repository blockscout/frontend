import type { NextPage, GetStaticPaths } from 'next';
import Head from 'next/head';
import React from 'react';

import { getAvailablePaths } from 'lib/networks';
import PrivateTags from 'ui/pages/PrivateTags';

const TransactionTagsPage: NextPage = () => {
  return (
    <>
      <Head><title>Public tags</title></Head>
      <PrivateTags tab="transaction"/>
    </>
  );
};

export default TransactionTagsPage;

export const getStaticPaths: GetStaticPaths = async() => {
  return { paths: getAvailablePaths(), fallback: false };
};

export const getStaticProps = async() => {
  return {
    props: {},
  };
};
