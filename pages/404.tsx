import React from 'react';

import PageServer from 'lib/next/PageServer';
import AppError from 'ui/shared/AppError/AppError';

const Page = () => {
  return (
    <PageServer pathname="/404">
      <AppError statusCode={ 404 } mt="50px"/>
    </PageServer>
  );
};

export default Page;
