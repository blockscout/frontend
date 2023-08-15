import type { NextPage } from 'next';
import React from 'react';

import PageServer from 'nextjs/PageServer';

import Stats from 'ui/pages/Stats';

const Page: NextPage = () => {
  return (
    <PageServer pathname="/stats">
      <Stats/>
    </PageServer>
  );
};

export default Page;

export { stats as getServerSideProps } from 'nextjs/getServerSideProps';
