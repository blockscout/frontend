import type { NextPage } from 'next';
import React from 'react';

import PageNextJs from 'nextjs/PageNextJs';

import Stats from 'ui/pages/Stats';

const Page: NextPage = () => {
  return (
    <PageNextJs pathname="/stats">
      <Stats/>
    </PageNextJs>
  );
};

export default Page;

export { stats as getServerSideProps } from 'nextjs/getServerSideProps';
