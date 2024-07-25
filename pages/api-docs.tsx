import type { NextPage } from 'next';
import { useTranslation } from 'next-i18next';
import React from 'react';

import PageNextJs from 'nextjs/PageNextJs';

import SwaggerUI from 'ui/apiDocs/SwaggerUI';
import PageTitle from 'ui/shared/Page/PageTitle';

const Page: NextPage = () => {
  const { t } = useTranslation('common');

  return (
    <PageNextJs pathname="/api-docs">
      <PageTitle title={ t('area.API_Documentation') }/>
      <SwaggerUI/>
    </PageNextJs>
  );
};

export default Page;

export { apiDocs as getServerSideProps } from 'nextjs/getServerSideProps';
