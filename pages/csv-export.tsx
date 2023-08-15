import type { NextPage } from 'next';
import React from 'react';

import PageServer from 'nextjs/PageServer';

import CsvExport from 'ui/pages/CsvExport';

const Page: NextPage = () => {
  return (
    <PageServer pathname="/csv-export">
      <CsvExport/>
    </PageServer>
  );
};

export default Page;

export { csvExport as getServerSideProps } from 'nextjs/getServerSideProps';
