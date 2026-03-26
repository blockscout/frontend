import type { NextPage } from 'next';
import React from 'react';

import PageNextJs from 'nextjs/PageNextJs';

import CsvExport from 'ui/pages/CsvExport';

// TODO @tom2drum remove page and component
const Page: NextPage = () => {
  return (
    <PageNextJs pathname="/csv-export">
      <CsvExport/>
    </PageNextJs>
  );
};

export default Page;
