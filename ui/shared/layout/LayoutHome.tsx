/* eslint-disable */


import React from 'react';

import type { Props } from './types';

import AppErrorBoundary from 'ui/shared/AppError/AppErrorBoundary';
import HeaderAlert from 'ui/snippets/header/HeaderAlert';
import HeaderMobile from 'ui/snippets/header/HeaderMobile';
import MocaBanner from 'ui/snippets/topBar/MocaBanner';
import * as Layout from './components';

const LayoutHome = ({ children }: Props) => {
  return (
    <Layout.Container>
      { /* <Layout.TopRow/> */ }
      <Layout.NavBar/>
      <MocaBanner />
      <HeaderMobile hideSearchBar/>
      <Layout.MainArea background="#f4f4f4">
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
