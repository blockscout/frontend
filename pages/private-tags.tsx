import React from 'react';
import type { NextPage } from 'next';
import Head from 'next/head'

import PrivateTags from 'ui/pages/PrivateTags';

const PrivateTagsPage: NextPage = () => {
  return (
    <>
      <Head><title>Private tags</title></Head>
      <PrivateTags/>
    </>
  );
}

export default PrivateTagsPage
