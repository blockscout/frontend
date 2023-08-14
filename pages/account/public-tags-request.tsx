import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';

import PageServer from 'lib/next/PageServer';

const PublicTags = dynamic(() => import('ui/pages/PublicTags'), { ssr: false });

const Page: NextPage = () => {
  return (
    <PageServer pathname="/account/public-tags-request">
      <PublicTags/>
    </PageServer>
  );
};

export default Page;

export { account as getServerSideProps } from 'lib/next/getServerSideProps';
