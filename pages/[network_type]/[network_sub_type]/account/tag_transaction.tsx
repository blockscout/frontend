import type { NextPage } from 'next';
import Head from 'next/head';
import React from 'react';

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
