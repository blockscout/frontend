import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';

import PageServer from 'nextjs/PageServer';

const VerifiedAddresses = dynamic(() => import('ui/pages/VerifiedAddresses'), { ssr: false });

const Page: NextPage = () => {
  return (
    <PageServer pathname="/account/verified-addresses">
      <VerifiedAddresses/>
    </PageServer>
  );
};

export default Page;

export { verifiedAddresses as getServerSideProps } from 'nextjs/getServerSideProps';
