import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';

import PageNextJs from 'nextjs/PageNextJs';

const Accounts = dynamic(() => import('ui/pages/Accounts'), { ssr: false });

const Page: NextPage = () => {
  return (
    <PageNextJs pathname="/accounts">
      <Accounts/>
    </PageNextJs>
  );
};

export default Page;

export { accounts as getServerSideProps } from 'nextjs/getServerSideProps';
