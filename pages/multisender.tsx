import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';

import PageNextJs from 'nextjs/PageNextJs';

const Multisender = dynamic(() => import('ui/pages/Multisender'), { ssr: false });

const Page: NextPage = () => {
  return (
    <PageNextJs pathname="/multisender">
      <Multisender/>
    </PageNextJs>
  );
};

export default Page;

export { account as getServerSideProps } from 'nextjs/getServerSideProps';
