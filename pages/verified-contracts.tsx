import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';

import PageServer from 'lib/next/PageServer';
import Page from 'ui/shared/Page/Page';

const VerifiedContracts = dynamic(() => import('ui/pages/VerifiedContracts'), { ssr: false });

const VerifiedContractsPage: NextPage = () => {
  return (
    <PageServer pathname="/verified-contracts">
      <Page>
        <VerifiedContracts/>
      </Page>
    </PageServer>
  );
};

export default VerifiedContractsPage;

export { base as getServerSideProps } from 'lib/next/getServerSideProps';
