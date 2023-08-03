import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';

import type { Props } from 'lib/next/getServerSideProps';
import PageServer from 'lib/next/PageServer';

const SearchResults = dynamic(() => import('ui/pages/SearchResults'), { ssr: false });

const SearchResultsPage: NextPage<Props> = (props: Props) => {
  return (
    <PageServer pathname="/search-results" query={ props }>
      <SearchResults/>
    </PageServer>
  );
};

export default SearchResultsPage;

export { base as getServerSideProps } from 'lib/next/getServerSideProps';
