import type { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import { route } from 'nextjs-routes';
import React from 'react';

import type { SearchRedirectResult } from 'types/api/search';

import buildUrlNode from 'lib/api/buildUrlNode';
import fetchFactory from 'lib/api/nodeFetch';
import getNetworkTitle from 'lib/networks/getNetworkTitle';
import type { Props } from 'lib/next/getServerSideProps';
import { getServerSideProps as getServerSidePropsBase } from 'lib/next/getServerSideProps';
import * as serverTiming from 'lib/next/serverTiming';
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
  const start = Date.now();

  try {
    const q = String(query.q);
    const url = buildUrlNode('search_check_redirect', undefined, { q });
    const redirectsResponse = await fetchFactory(req)(url, {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore:next-line timeout property exist for AbortSignal since Node.js 17 - https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal
      // but @types/node has not updated their types yet, see issue https://github.com/DefinitelyTyped/DefinitelyTyped/issues/60868
      signal: AbortSignal.timeout(1_000),
    });
    const payload = await redirectsResponse.json() as SearchRedirectResult;

    if (!payload || typeof payload !== 'object' || !payload.redirect) {
      throw Error();
    }

    const redirectUrl = (() => {
      switch (payload.type) {
        case 'block': {
          return route({ pathname: '/block/[height]', query: { height: q } });
        }
        case 'address': {
          return route({ pathname: '/address/[hash]', query: { hash: payload.parameter || q } });
        }
        case 'transaction': {
          return route({ pathname: '/tx/[hash]', query: { hash: q } });
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

  const end = Date.now();

  serverTiming.appendValue(res, 'query.search.check-redirect', end - start);

  return getServerSidePropsBase({ req, res, resolvedUrl, query });
};
