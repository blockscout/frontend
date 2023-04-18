import type { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import React from 'react';

import appConfig from 'configs/app/config';
import getNetworkTitle from 'lib/networks/getNetworkTitle';
import type { Props } from 'lib/next/getServerSideProps';
import { getServerSideProps as getServerSidePropsBase } from 'lib/next/getServerSideProps';
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

export const getServerSideProps: GetServerSideProps<Props> = async(args) => {
  if (!appConfig.reCaptcha.siteKey) {
    return {
      notFound: true,
    };
  }

  return getServerSidePropsBase(args);
};
