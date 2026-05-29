// SPDX-License-Identifier: LicenseRef-Blockscout

import dynamic from 'next/dynamic';
import React from 'react';

import type { NextPageWithLayout } from 'src/server/types';

import type { Props } from 'src/server/getServerSideProps/handlers';
import PageNextJs from 'src/server/PageNextJs';

import LayoutSearchResults from 'src/shell/layout/LayoutSearchResults';

import config from 'src/config';

const SearchResults = dynamic(() => {
  if (config.features.multichain.isEnabled) {
    return import('src/features/multichain/pages/search-results/SearchResults');
  }

  return import('src/slices/search/pages/search-results/SearchResults');
}, { ssr: false });

const Page: NextPageWithLayout<Props> = (props: Props) => {
  return (
    <PageNextJs pathname="/search-results" query={ props.query }>
      <SearchResults/>
    </PageNextJs>
  );
};

Page.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <LayoutSearchResults>
      { page }
    </LayoutSearchResults>
  );
};

export default Page;

export { base as getServerSideProps } from 'src/server/getServerSideProps/main';
