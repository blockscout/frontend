// SPDX-License-Identifier: LicenseRef-Blockscout

import type { NextPage } from 'next';
import React from 'react';

import PageNextJs from 'src/server/PageNextJs';

import Sol2Uml from 'src/features/sol2uml/pages/index/Sol2Uml';

const Page: NextPage = () => {
  return (
    <PageNextJs pathname="/visualize/sol2uml">
      <Sol2Uml/>
    </PageNextJs>
  );
};

export default Page;

export { base as getServerSideProps } from 'src/server/getServerSideProps/main';
