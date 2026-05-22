// SPDX-License-Identifier: LicenseRef-Blockscout

import HeaderAlert from 'client/shell/header/components/HeaderAlert';
import HeaderDesktop from 'client/shell/header/components/HeaderDesktop';
import HeaderMobile from 'client/shell/header/components/HeaderMobile';
import React from 'react';

import type { Props } from './types';

import AppErrorBoundary from 'ui/shared/AppError/AppErrorBoundary';

import * as Layout from './components';

const LayoutError = ({ children }: Props) => {
  return (
    <Layout.Root content={ children }>
      <Layout.Container>
        <Layout.TopRow/>
        <Layout.NavBar/>
        <HeaderMobile/>
        <Layout.MainArea>
          <Layout.SideBar/>
          <Layout.MainColumn>
            <HeaderAlert/>
            <HeaderDesktop/>
            <AppErrorBoundary>
              <main>
                { children }
              </main>
            </AppErrorBoundary>
          </Layout.MainColumn>
        </Layout.MainArea>
        <Layout.Footer/>
      </Layout.Container>
    </Layout.Root>
  );
};

export default LayoutError;
