// SPDX-License-Identifier: LicenseRef-Blockscout

import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';

import PageNextJs from 'src/server/PageNextJs';

const VerifiedAddresses = dynamic(() => import('src/features/account/pages/verified-addresses/VerifiedAddresses'), { ssr: false });

const Page: NextPage = () => {
  return (
    <PageNextJs pathname="/account/verified-addresses">
      <VerifiedAddresses/>
    </PageNextJs>
  );
};

export default Page;

export { verifiedAddresses as getServerSideProps } from 'src/server/getServerSideProps/main';
