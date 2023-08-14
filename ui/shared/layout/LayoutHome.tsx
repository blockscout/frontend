import React from 'react';

import type { Props } from './types';

import IndexingAlertBlocks from 'ui/home/IndexingAlertBlocks';
import AppErrorScreen from 'ui/shared/AppError/AppErrorScreen';
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
          <AppErrorScreen>
            { children }
          </AppErrorScreen>
        </Layout.MainColumn>
      </Layout.Content>
      <Layout.Footer/>
    </Layout.Container>
  );
};

export default LayoutHome;
