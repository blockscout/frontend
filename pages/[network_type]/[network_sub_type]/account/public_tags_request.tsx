import type { NextPage, GetStaticPaths } from 'next';
import Head from 'next/head';
import React from 'react';

import getAvailablePaths from 'lib/networks/getAvailablePaths';
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

export const getStaticPaths: GetStaticPaths = async() => {
  return { paths: getAvailablePaths(), fallback: false };
};

export const getStaticProps = async() => {
  return {
    props: {},
  };
};
