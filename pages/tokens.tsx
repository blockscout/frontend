import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';

import PageNextJs from 'nextjs/PageNextJs';

const Tokens = dynamic(() => import('ui/pages/Tokens'), { ssr: false });

const Page: NextPage = () => {
  return (
    <PageNextJs pathname="/tokens">
      <Tokens/>
    </PageNextJs>
  );
};

export default Page;

export { base as getServerSideProps } from 'nextjs/getServerSideProps';
