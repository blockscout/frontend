import React from 'react';

import type { Props } from './types';

import AppErrorBoundary from 'ui/shared/AppError/AppErrorBoundary';
import Header from 'ui/snippets/header/Header';
import HeaderAlert from 'ui/snippets/header/HeaderAlert';

import * as Layout from './components';

const LayoutDefault = ({ children }: Props) => {
  return (
    <Layout.Container>
      <Layout.MainArea>
        <Layout.MainColumn
          paddingTop={{ base: '138px', lg: 6 }}
          paddingX={{ base: 4, lg: 6 }}
        >
          <HeaderAlert/>
          <Header isMarketplaceAppPage/>
          <AppErrorBoundary>
            <Layout.Content pt={{ base: 0, lg: 6 }}>
              { children }
            </Layout.Content>
          </AppErrorBoundary>
        </Layout.MainColumn>
      </Layout.MainArea>
      <Layout.Footer/>
    </Layout.Container>
  );
};

export default LayoutDefault;
