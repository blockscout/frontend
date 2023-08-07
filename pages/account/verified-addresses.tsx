import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';

import PageServer from 'lib/next/PageServer';
import Page from 'ui/shared/Page/Page';

const VerifiedAddresses = dynamic(() => import('ui/pages/VerifiedAddresses'), { ssr: false });

const VerifiedAddressesPage: NextPage = () => {
  return (
    <PageServer pathname="/account/verified-addresses">
      <Page>
        <VerifiedAddresses/>
      </Page>
    </PageServer>
  );
};

export default VerifiedAddressesPage;

export { verifiedAddresses as getServerSideProps } from 'lib/next/getServerSideProps';
