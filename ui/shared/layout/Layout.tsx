import React from 'react';

import type { Props } from './types';

import AppErrorBoundary from 'ui/shared/AppError/AppErrorBoundary';
import HeaderAlert from 'ui/snippets/header/HeaderAlert';
import HeaderDesktop from 'ui/snippets/header/HeaderDesktop';
import HeaderMobile from 'ui/snippets/header/HeaderMobile';

import * as Layout from './components';

const LayoutDefault = ({ children }: Props) => {
  return (
    <Layout.Container h="97vh">
      { /* <Layout.TopRow/> */ }
      <Layout.NavBar/>
      <HeaderMobile/>
      <Layout.MainArea background="linear-gradient(108deg, #FFF 0%, #F4F2FF 50.26%, #F2EFFF 100.3%)">
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
      { /* <Layout.Footer/> */ }
    </Layout.Container>
  );
};

export default LayoutDefault;
