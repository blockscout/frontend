// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { NextPageWithLayout } from 'src/server/types';

import PageNextJs from 'src/server/PageNextJs';

import LayoutError from 'src/shell/layout/LayoutError';

import AppError from 'src/shared/errors/AppError';

const error = new Error('Not found', { cause: { status: 404 } });

const Page: NextPageWithLayout = () => {
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
