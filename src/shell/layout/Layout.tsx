// SPDX-License-Identifier: LicenseRef-Blockscout

/* eslint-disable consistent-default-export-name/default-export-match-filename */
import React from 'react';

import type { Props } from './types';

import HeaderAlert from 'src/shell/header/HeaderAlert';
import HeaderDesktop from 'src/shell/header/HeaderDesktop';
import HeaderMobile from 'src/shell/header/HeaderMobile';

import AppErrorBoundary from 'src/shared/errors/AppErrorBoundary';

import * as Layout from './components';

const LayoutDefault = ({ children }: Props) => {
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
              <Layout.Content>
                { children }
              </Layout.Content>
            </AppErrorBoundary>
          </Layout.MainColumn>
        </Layout.MainArea>
        <Layout.Footer/>
      </Layout.Container>
    </Layout.Root>
  );
};

export default LayoutDefault;
