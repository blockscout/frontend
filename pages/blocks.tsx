import type { NextPage } from 'next';
import React from 'react';

import BlocksNextPage from 'lib/next/blocks/BlocksNextPage';

const BlockPage: NextPage = () => {
  return (
    <BlocksNextPage/>
  );
};

export default BlockPage;

export { getServerSideProps } from 'lib/next/getServerSidePropsDummy';
