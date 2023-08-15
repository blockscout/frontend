import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';

import PageServer from 'nextjs/PageServer';

const Tokens = dynamic(() => import('ui/pages/Tokens'), { ssr: false });

const Page: NextPage = () => {
  return (
    <PageServer pathname="/tokens">
      <Tokens/>
    </PageServer>
  );
};

export default Page;

export { base as getServerSideProps } from 'nextjs/getServerSideProps';
