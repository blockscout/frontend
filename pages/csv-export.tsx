import type { NextPage } from 'next';
import Head from 'next/head';
import React from 'react';

import getNetworkTitle from 'lib/networks/getNetworkTitle';
import CsvExport from 'ui/pages/CsvExport';

const CsvExportPage: NextPage = () => {
  const title = getNetworkTitle();
  return (
    <>
      <Head>
        <title>{ title }</title>
      </Head>
      <CsvExport/>
    </>
  );
};

export default CsvExportPage;

export { getServerSideProps } from 'lib/next/getServerSideProps';
