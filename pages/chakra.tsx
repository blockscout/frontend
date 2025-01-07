import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';

import PageNextJs from 'nextjs/PageNextJs';

const Chakra = dynamic(() => import('ui/pages/Chakra'), { ssr: false });

const Page: NextPage = () => {
  return (
    <PageNextJs pathname="/chakra">
      <Chakra/>
    </PageNextJs>
  );
};

export default Page;

export { login as getServerSideProps } from 'nextjs/getServerSideProps';
