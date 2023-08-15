import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';

import PageServer from 'nextjs/PageServer';

import PageTitle from 'ui/shared/Page/PageTitle';

const Marketplace = dynamic(() => import('ui/pages/Marketplace'), { ssr: false });

const Page: NextPage = () => {
  return (
    <PageServer pathname="/apps">
      <>
        <PageTitle title="Marketplace"/>
        <Marketplace/>
      </>
    </PageServer>
  );
};

export default Page;

export { marketplace as getServerSideProps } from 'nextjs/getServerSideProps';
