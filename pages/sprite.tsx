// SPDX-License-Identifier: LicenseRef-Blockscout

import Sprite from 'client/sprite/pages/Sprite';
import type { NextPage } from 'next';
import React from 'react';

import PageNextJs from 'nextjs/PageNextJs';

const Page: NextPage = () => {
  return (
    <PageNextJs pathname="/sprite">
      <Sprite/>
    </PageNextJs>
  );
};

export default Page;

export { base as getServerSideProps } from 'nextjs/getServerSideProps/main';
