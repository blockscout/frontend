import React from 'react';

import PageServer from 'lib/next/PageServer';
import type { NextPageWithLayout } from 'pages/_app';
import Home from 'ui/pages/Home';
import LayoutHome from 'ui/shared/layout/LayoutHome';

const Page: NextPageWithLayout = () => {
  return (
    <PageServer pathname="/">
      <Home/>
    </PageServer>
  );
};

Page.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <LayoutHome>
      { page }
    </LayoutHome>
  );
};

export default Page;

export { base as getServerSideProps } from 'lib/next/getServerSideProps';
