import React from 'react';

import type { Props } from './types';

import IndexingAlertBlocks from 'ui/home/IndexingAlertBlocks';
import AppErrorBoundary from 'ui/shared/AppError/AppErrorBoundary';
import Header from 'ui/snippets/header/Header';

import * as Layout from './components';

const LayoutDefault = ({ children }: Props) => {
  return (
    <Layout.Container>
      <Layout.Content>
        <Layout.SideBar/>
        <Layout.MainColumn>
          <IndexingAlertBlocks/>
          <Header/>
          <AppErrorBoundary>
            { children }
          </AppErrorBoundary>
        </Layout.MainColumn>
      </Layout.Content>
      <Layout.Footer/>
    </Layout.Container>
  );
};

export default LayoutDefault;
