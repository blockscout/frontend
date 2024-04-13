import React from 'react';

import type { Props } from './types';

import AppErrorBoundary from 'ui/shared/AppError/AppErrorBoundary';
import HeaderAlert from 'ui/snippets/header/HeaderAlert';

import * as Layout from './components';

const LayoutDefault = ({ children }: Props) => {
  return (
    <Layout.Container>
      { /*<Layout.TopRow/>*/ }
      { /*<HeaderMobile/>*/ }
      <Layout.Header/>
      <Layout.MainArea>
        { /*<Layout.SideBar/>*/ }
        { /*<Layout.MainColumn>*/ }
        <HeaderAlert/>
        { /*<HeaderDesktop/>*/ }
        <AppErrorBoundary>
          <Layout.Content>{ children }</Layout.Content>
        </AppErrorBoundary>
        { /*</Layout.MainColumn>*/ }
      </Layout.MainArea>
      <Layout.Footer/>
    </Layout.Container>
  );
};

export default LayoutDefault;
