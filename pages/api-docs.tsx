import type { NextPage } from 'next';
import React from 'react';

import PageServer from 'nextjs/PageServer';

import SwaggerUI from 'ui/apiDocs/SwaggerUI';
import PageTitle from 'ui/shared/Page/PageTitle';

const Page: NextPage = () => {
  return (
    <PageServer pathname="/api-docs">
      <PageTitle title="API Documentation"/>
      <SwaggerUI/>
    </PageServer>
  );
};

export default Page;

export { apiDocs as getServerSideProps } from 'nextjs/getServerSideProps';
