import type { GetServerSideProps, NextPage } from 'next';
import React from 'react';

import appConfig from 'configs/app/config';
import type { Props } from 'lib/next/getServerSideProps';
import { getServerSideProps as getServerSidePropsBase } from 'lib/next/getServerSideProps';
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

export const getServerSideProps: GetServerSideProps<Props> = async(args) => {
  if (!appConfig.reCaptcha.siteKey) {
    return {
      notFound: true,
    };
  }

  return getServerSidePropsBase(args);
};
