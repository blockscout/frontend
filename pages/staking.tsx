import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';

import PageNextJs from 'nextjs/PageNextJs';

const Staking = dynamic(() => import('ui/pages/Staking'), { ssr: false });

const Page: NextPage = () => {
  return (
    <PageNextJs pathname="/staking">
      <Staking/>
    </PageNextJs>
  );
};

export default Page;

export { base as getServerSideProps } from 'nextjs/getServerSideProps';
