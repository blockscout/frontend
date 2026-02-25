import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';

import PageNextJs from 'nextjs/PageNextJs';

const OpSuperchainEcosystems = dynamic(() => import('ui/optimismSuperchain/ecosystems/OpSuperchainEcosystems'), { ssr: false });

const Page: NextPage = () => {
  return (
    <PageNextJs pathname="/ecosystems">
      <OpSuperchainEcosystems/>
    </PageNextJs>
  );
};

export default Page;

export { base as getServerSideProps } from 'nextjs/getServerSideProps/main';
