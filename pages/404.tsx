import React from 'react';

import PageServer from 'lib/next/PageServer';
import AppError from 'ui/shared/AppError/AppError';
import Page from 'ui/shared/Page/Page';

const Custom404 = () => {
  return (
    <PageServer pathname="/404">
      <Page>
        <AppError statusCode={ 404 } mt="50px"/>
      </Page>
    </PageServer>
  );
};

export default Custom404;
