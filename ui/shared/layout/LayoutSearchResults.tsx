import React from 'react';

import type { Props } from './types';

import * as Layout from './components';

const LayoutSearchResults = ({ children }: Props) => {

  return (
    <Layout.Container>
      <Layout.MainArea>
        <Layout.SideBar/>
        <Layout.MainColumn>
          { children }
        </Layout.MainColumn>
      </Layout.MainArea>
      <Layout.Footer/>
    </Layout.Container>
  );
};

export default LayoutSearchResults;
