import React from 'react';

import type { Props } from './types';

import AppErrorBoundary from 'ui/shared/AppError/AppErrorBoundary';
import HeaderDesktop from 'ui/snippets/header/HeaderDesktop';
import HeaderMobile from 'ui/snippets/header/HeaderMobile';

import * as Layout from './components';

const LayoutDefault = ({ children }: Props) => {
  return (
    <Layout.Container>
      <Layout.TopRow/>
      <HeaderMobile/>
      <Layout.MainArea>
        <Layout.MainColumn
          paddingTop={{ base: 16, lg: 6 }}
          paddingX={{ base: 4, lg: 6 }}
        >
          <HeaderDesktop isMarketplaceAppPage/>
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
