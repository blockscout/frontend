import type { NextPage } from 'next';
import React from 'react';

import PageNextJs from 'nextjs/PageNextJs';

import AdvancedFilter from 'ui/pages/AdvancedFilter';

const Page: NextPage = () => {
  return (
    <PageNextJs pathname="/csv-export">
      <AdvancedFilter/>
    </PageNextJs>
  );
};

export default Page;

export { base as getServerSideProps } from 'nextjs/getServerSideProps';
