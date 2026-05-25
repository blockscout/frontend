// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { NextPageWithLayout } from 'nextjs/types';

import PageNextJs from 'nextjs/PageNextJs';

import LayoutError from 'client/shell/layout/LayoutError';

import AppError from 'client/shared/errors/AppError';

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
