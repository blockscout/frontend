// SPDX-License-Identifier: LicenseRef-Blockscout

import type { NextPage } from 'next';
import React from 'react';

import PageNextJs from 'src/server/PageNextJs';

import Uptime from 'src/features/chain-variants/mega-eth/pages/uptime/Uptime';

const Page: NextPage = () => {
  return (
    <PageNextJs pathname="/uptime">
      <Uptime/>
    </PageNextJs>
  );
};

export default Page;

export { megaEth as getServerSideProps } from 'src/server/getServerSideProps/main';
