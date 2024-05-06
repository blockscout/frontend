import React from 'react';

import type { Props } from './types';

import AppErrorBoundary from 'ui/shared/AppError/AppErrorBoundary';
import HeaderMobile from 'ui/snippets/header/HeaderMobile';

import * as Layout from './components';

const LayoutDefault = ({ children }: Props) => {
  return (
    <Layout.Container
      overflowY="hidden"
      height="$100vh"
      display="flex"
      flexDirection="column"
    >
      <Layout.TopRow/>
      <HeaderMobile hideSearchBar/>
      <Layout.MainArea minH="auto" flex={ 1 }>
        <Layout.MainColumn
          paddingTop={{ base: 0, lg: 0 }}
          paddingBottom={ 0 }
          paddingX={{ base: 4, lg: 6 }}
        >
          <AppErrorBoundary>
            <Layout.Content pt={{ base: 0, lg: 2 }} flexGrow={ 1 }>
              { children }
            </Layout.Content>
          </AppErrorBoundary>
        </Layout.MainColumn>
      </Layout.MainArea>
    </Layout.Container>
  );
};

export default LayoutDefault;
