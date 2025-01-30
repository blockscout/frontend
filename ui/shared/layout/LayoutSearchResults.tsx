import React from 'react';

import type { Props } from './types';

import * as Layout from './components';

const LayoutSearchResults = ({ children }: Props) => {

  return (
    <Layout.Container>
      { children }
    </Layout.Container>
  );
};

export default LayoutSearchResults;
