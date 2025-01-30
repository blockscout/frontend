import React from 'react';

import type { Props } from './types';

import AppErrorBoundary from 'ui/shared/AppError/AppErrorBoundary';
import HeaderAlert from 'ui/snippets/header/HeaderAlert';
import HeaderMobile from 'ui/snippets/header/HeaderMobile';

import * as Layout from './components';

const LayoutHome = ({ children }: Props) => {
  return (
    <Layout.Container>
      <HeaderMobile isHomePage/>
      <Layout.MainArea>
        <Layout.SideBar/>
        <Layout.MainColumn>
          <Layout.Content>
            <HeaderAlert/>
            <AppErrorBoundary>
              { children }
            </AppErrorBoundary>
          </Layout.Content>
        </Layout.MainColumn>
      </Layout.MainArea>
      <Layout.Footer/>
    </Layout.Container>
  );
};

export default LayoutHome;
