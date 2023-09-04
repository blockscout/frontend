import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';

import PageNextJs from 'nextjs/PageNextJs';

import PageTitle from 'ui/shared/PageTitle/PageTitle';

const Marketplace = dynamic(() => import('ui/pages/Marketplace'), { ssr: false });

const Page: NextPage = () => {
  return (
    <PageNextJs pathname="/apps">
      <PageTitle>
        Marketplace
      </PageTitle>
      <Marketplace/>
    </PageNextJs>
  );
};

export default Page;

export { marketplace as getServerSideProps } from 'nextjs/getServerSideProps';
