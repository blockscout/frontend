import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';

import PageServer from 'lib/next/PageServer';

const ApiKeys = dynamic(() => import('ui/pages/ApiKeys'), { ssr: false });

const Page: NextPage = () => {
  return (
    <PageServer pathname="/account/api-key">
      <ApiKeys/>
    </PageServer>
  );
};

export default Page;

export { account as getServerSideProps } from 'lib/next/getServerSideProps';
