import React from 'react';

import PageServer from 'nextjs/PageServer';

import type { NextPageWithLayout } from 'pages/_app';
import AppError from 'ui/shared/AppError/AppError';
import LayoutError from 'ui/shared/layout/LayoutError';

const error = new Error('Not found', { cause: { status: 404 } });

const Page: NextPageWithLayout = () => {
  return (
    <PageServer pathname="/404">
      <AppError error={ error }/>
    </PageServer>
  );
};

Page.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <LayoutError>
      { page }
    </LayoutError>
  );
};

export default Page;
