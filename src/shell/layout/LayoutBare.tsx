// SPDX-License-Identifier: LicenseRef-Blockscout

import { chakra } from '@chakra-ui/react';
import React from 'react';

import type { Props } from './types';

import AppErrorBoundary from 'src/shared/errors/AppErrorBoundary';

import * as Layout from './components';

const LayoutBare = ({ children }: Props) => {
  return (
    <Layout.Root content={ children }>
      <AppErrorBoundary mx="auto" px={ 4 }>
        <chakra.main>
          { children }
        </chakra.main>
      </AppErrorBoundary>
    </Layout.Root>
  );
};

export default LayoutBare;
