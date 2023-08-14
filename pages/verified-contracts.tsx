import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';

import PageServer from 'lib/next/PageServer';

const VerifiedContracts = dynamic(() => import('ui/pages/VerifiedContracts'), { ssr: false });

const Page: NextPage = () => {
  return (
    <PageServer pathname="/verified-contracts">
      <VerifiedContracts/>
    </PageServer>
  );
};

export default Page;

export { base as getServerSideProps } from 'lib/next/getServerSideProps';
