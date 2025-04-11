import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';

import PageNextJs from 'nextjs/PageNextJs';

const Verification = dynamic(() => import('ui/pages/Verification'), { ssr: false });

const Page: NextPage = () => {
  return (
    <PageNextJs pathname="/verification">
      <Verification/>
    </PageNextJs>
  );
};

export default Page;

export { base as getServerSideProps } from 'nextjs/getServerSideProps';
