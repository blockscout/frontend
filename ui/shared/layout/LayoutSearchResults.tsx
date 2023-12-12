import React from 'react';

import type { Props } from './types';

import * as Layout from './components';

const LayoutSearchResults = ({ children }: Props) => {

  return (
    <Layout.Container>
      <Layout.TopRow/>
      { children }
    </Layout.Container>
  );
};

export default LayoutSearchResults;
