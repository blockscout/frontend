import type { NextPage } from 'next';
import Head from 'next/head';
import React from 'react';

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
