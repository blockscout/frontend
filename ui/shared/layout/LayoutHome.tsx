import React from 'react';

import type { Props } from './types';

import IndexingAlertBlocks from 'ui/home/IndexingAlertBlocks';
import AppErrorBoundary from 'ui/shared/AppError/AppErrorBoundary';
import Header from 'ui/snippets/header/Header';

import * as Layout from './components';

const LayoutHome = ({ children }: Props) => {

  return (
    <Layout.Container>
      <Layout.Content>
        <Layout.SideBar/>
        <Layout.MainColumn
          paddingTop={{ base: '88px', lg: 9 }}
        >
          <IndexingAlertBlocks/>
          <Header isHomePage/>
          <AppErrorBoundary>
            { children }
          </AppErrorBoundary>
        </Layout.MainColumn>
      </Layout.Content>
      <Layout.Footer/>
    </Layout.Container>
  );
};

export default LayoutHome;
