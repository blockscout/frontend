// SPDX-License-Identifier: LicenseRef-Blockscout

import React from 'react';

import type { Props } from './types';

import HeaderAlert from 'client/shell/header/HeaderAlert';
import HeaderDesktop from 'client/shell/header/HeaderDesktop';
import HeaderMobile from 'client/shell/header/HeaderMobile';

import AppErrorBoundary from 'client/shared/errors/AppErrorBoundary';

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
