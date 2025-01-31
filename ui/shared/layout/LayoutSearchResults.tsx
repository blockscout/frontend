import React from 'react';

import type { Props } from './types';

import * as Layout from './components';

const LayoutSearchResults = ({ children }: Props) => {

  return (
    <Layout.Container>
      <Layout.TopRow/>
      <Layout.NavBar/>
      { children }
    </Layout.Container>
  );
};

export default LayoutSearchResults;
