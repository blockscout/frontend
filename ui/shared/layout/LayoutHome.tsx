import React from 'react';

import type { Props } from './types';

import AppErrorBoundary from 'ui/shared/AppError/AppErrorBoundary';
import HeaderAlert from 'ui/snippets/header/HeaderAlert';
import HeaderMobile from 'ui/snippets/header/HeaderMobile';

import * as Layout from './components';

const LayoutHome = ({ children }: Props) => {
  return (
    <Layout.Container>
      { /* <Layout.TopRow/> */ }
      <Layout.NavBar/>
      <HeaderMobile hideSearchBar/>
      <Layout.MainArea background="linear-gradient(108deg, #FFF 0%, #F4F2FF 50.26%, #F2EFFF 100.3%)">
        <Layout.SideBar/>
        <Layout.MainColumn
          paddingTop={{ base: 3, lg: 6 }}
        >
          <HeaderAlert/>
          <AppErrorBoundary>
            { children }
          </AppErrorBoundary>
        </Layout.MainColumn>
      </Layout.MainArea>
      <Layout.Footer/>
    </Layout.Container>
  );
};

export default LayoutHome;
