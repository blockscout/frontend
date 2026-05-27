// SPDX-License-Identifier: LicenseRef-Blockscout

import config from 'client/config';
import dynamic from 'next/dynamic';
import React from 'react';

import type { NextPageWithLayout } from 'nextjs/types';

import type { Props } from 'nextjs/getServerSideProps/handlers';
import PageNextJs from 'nextjs/PageNextJs';

import LayoutSearchResults from 'client/shell/layout/LayoutSearchResults';

const SearchResults = dynamic(() => {
  if (config.features.multichain.isEnabled) {
    return import('client/features/multichain/pages/search-results/SearchResults');
  }

  return import('client/slices/search/pages/search-results/SearchResults');
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

export { base as getServerSideProps } from 'nextjs/getServerSideProps/main';
