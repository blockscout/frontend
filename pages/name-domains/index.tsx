import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';

import PageNextJs from 'nextjs/PageNextJs';

const NameDomains = dynamic(() => import('ui/pages/NameDomains'), { ssr: false });

const Page: NextPage = () => {
  return (
    <PageNextJs pathname="/name-domains">
      <NameDomains/>
    </PageNextJs>
  );
};

export default Page;

export { nameService as getServerSideProps } from 'nextjs/getServerSideProps';
