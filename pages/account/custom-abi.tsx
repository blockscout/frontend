import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';

import PageServer from 'nextjs/PageServer';

const CustomAbi = dynamic(() => import('ui/pages/CustomAbi'), { ssr: false });

const Page: NextPage = () => {
  return (
    <PageServer pathname="/account/custom-abi">
      <CustomAbi/>
    </PageServer>
  );
};

export default Page;

export { account as getServerSideProps } from 'nextjs/getServerSideProps';
