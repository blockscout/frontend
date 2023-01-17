import type { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import React from 'react';

import type { SearchRedirectResult } from 'types/api/search';

import buildUrlNode from 'lib/api/buildUrlNode';
import fetchFactory from 'lib/api/nodeFetch';
import link from 'lib/link/link';
import getNetworkTitle from 'lib/networks/getNetworkTitle';
import type { Props } from 'lib/next/getServerSideProps';
import { getServerSideProps as getServerSidePropsBase } from 'lib/next/getServerSideProps';
import SearchResults from 'ui/pages/SearchResults';

const SearchResultsPage: NextPage = () => {
  const title = getNetworkTitle();
  return (
    <>
      <Head>
        <title>{ title }</title>
      </Head>
      <SearchResults/>
    </>
  );
};

export default SearchResultsPage;

export const getServerSideProps: GetServerSideProps<Props> = async({ req, res, resolvedUrl, query }) => {
  try {
    const q = String(query.q);
    const url = buildUrlNode('search_check_redirect', undefined, { q });
    const redirectsResponse = await fetchFactory(req)(url);
    const payload = await redirectsResponse.json() as SearchRedirectResult;

    if (!payload || typeof payload !== 'object' || !payload.redirect) {
      throw Error();
    }

    const redirectUrl = (() => {
      switch (payload.type) {
        case 'block': {
          return link('block', { id: q });
        }
        case 'address': {
          return link('address_index', { id: payload.parameter || q });
        }
        case 'transaction': {
          return link('tx', { id: q });
        }
      }
    })();

    if (!redirectUrl) {
      throw Error();
    }

    return {
      redirect: {
        destination: redirectUrl,
        permanent: false,
      },
    };
  } catch (error) {}

  return getServerSidePropsBase({ req, res, resolvedUrl, query });
};
