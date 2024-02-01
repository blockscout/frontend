import type { NextPage } from 'next';
import React from 'react';

import PageNextJs from 'nextjs/PageNextJs';

import Staking from '../../ui/pages/Staking';
const Page: NextPage = () => {
  return (
    <PageNextJs pathname="/staking">
      <Staking/>
    </PageNextJs>
  );
};

export default Page;
