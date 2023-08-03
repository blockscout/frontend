import type { NextPage } from 'next';
import React from 'react';

import PageServer from 'lib/next/PageServer';
import CsvExport from 'ui/pages/CsvExport';

const CsvExportPage: NextPage = () => {
  return (
    <PageServer pathname="/csv-export">
      <CsvExport/>
    </PageServer>
  );
};

export default CsvExportPage;

export { csvExport as getServerSideProps } from 'lib/next/getServerSideProps';
