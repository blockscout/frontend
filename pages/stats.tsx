import type { NextPage } from 'next';
import React from 'react';

import PageServer from 'lib/next/PageServer';

import Stats from '../ui/pages/Stats';

const StatsPage: NextPage = () => {
  return (
    <PageServer pathname="/stats">
      <Stats/>
    </PageServer>
  );
};

export default StatsPage;

export { stats as getServerSideProps } from 'lib/next/getServerSideProps';
