import React from 'react';

import PageServer from 'lib/next/PageServer';
import AppError from 'ui/shared/AppError/AppError';

const error = new Error('Not found', { cause: { status: 404 } });

const Page = () => {
  return (
    <PageServer pathname="/404">
      <AppError error={ error }/>
    </PageServer>
  );
};

export default Page;
