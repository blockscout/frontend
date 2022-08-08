import type { NextPage } from 'next';
import Head from 'next/head';
import React from 'react';

import PublicTags from 'ui/pages/PublicTags';

const PublicTagsPage: NextPage = () => {
  return (
    <>
      <Head><title>Public tags</title></Head>
      <PublicTags/>
    </>
  );
};

export default PublicTagsPage;
