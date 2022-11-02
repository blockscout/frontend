import type { NextPage } from 'next';
import Head from 'next/head';
import React from 'react';

import getNetworkTitle from 'lib/networks/getNetworkTitle';
import CustomAbi from 'ui/pages/CustomAbi';

const CustomAbiPage: NextPage = () => {
  const title = getNetworkTitle();
  return (
    <>
      <Head><title>{ title }</title></Head>
      <CustomAbi/>
    </>
  );
};

export default CustomAbiPage;

export { getServerSideProps } from 'lib/next/getServerSideProps';
