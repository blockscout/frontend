import type { NextPage, GetStaticPaths } from 'next';
import Head from 'next/head';
import React from 'react';

import { getAvailablePaths } from 'lib/networks';
import CustomAbi from 'ui/pages/CustomAbi';

const CustomAbiPage: NextPage = () => {
  return (
    <>
      <Head><title>Custom ABI</title></Head>
      <CustomAbi/>
    </>
  );
};

export default CustomAbiPage;

export const getStaticPaths: GetStaticPaths = async() => {
  return { paths: getAvailablePaths(), fallback: false };
};

export const getStaticProps = async() => {
  return {
    props: {},
  };
};
