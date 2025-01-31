import React from 'react';

import type { NextPageWithLayout } from 'nextjs/types';

import PageNextJs from 'nextjs/PageNextJs';

import { useRollbar } from 'lib/rollbar';
import AppError from 'ui/shared/AppError/AppError';
import LayoutError from 'ui/shared/layout/LayoutError';

const error = new Error('Not found', { cause: { status: 404 } });

const Page: NextPageWithLayout = () => {
  const rollbar = useRollbar();

  React.useEffect(() => {
    rollbar?.error('Page not found');
  }, [ rollbar ]);

  return (
    <PageNextJs pathname="/404">
      <AppError error={ error }/>
    </PageNextJs>
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
