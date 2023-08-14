import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';

import PageServer from 'lib/next/PageServer';

const PrivateTags = dynamic(() => import('ui/pages/PrivateTags'), { ssr: false });

const Page: NextPage = () => {
  return (
    <PageServer pathname="/account/tag-address">
      <PrivateTags/>
    </PageServer>
  );
};

export default Page;

export { account as getServerSideProps } from 'lib/next/getServerSideProps';
