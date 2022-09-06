import type { NextPage, GetStaticPaths } from 'next';
import Head from 'next/head';
import React from 'react';

import getAvailablePaths from 'lib/networks/getAvailablePaths';
import PrivateTags from 'ui/pages/PrivateTags';

const AddressTagsPage: NextPage = () => {
  return (
    <>
      <Head><title>Public tags</title></Head>
      <PrivateTags tab="address"/>
    </>
  );
};

export default AddressTagsPage;

export const getStaticPaths: GetStaticPaths = async() => {
  return { paths: getAvailablePaths(), fallback: false };
};

export const getStaticProps = async() => {
  return {
    props: {},
  };
};
