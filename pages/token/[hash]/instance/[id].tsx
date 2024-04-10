import type { GetServerSideProps, NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';

import type { Route } from 'nextjs-routes';
import type { Props } from 'nextjs/getServerSideProps';
import * as gSSP from 'nextjs/getServerSideProps';
import PageNextJs from 'nextjs/PageNextJs';
import fetchApi from 'nextjs/utils/fetchApi';

import getQueryParamString from 'lib/router/getQueryParamString';

const TokenInstance = dynamic(() => import('ui/pages/TokenInstance'), { ssr: false });

const pathname: Route['pathname'] = '/token/[hash]/instance/[id]';

const Page: NextPage<Props<typeof pathname>> = (props: Props<typeof pathname>) => {
  return (
    <PageNextJs pathname={ pathname } query={ props.query } apiData={ props.apiData }>
      <TokenInstance/>
    </PageNextJs>
  );
};

export default Page;

export const getServerSideProps: GetServerSideProps<Props<typeof pathname>> = async(ctx) => {
  const baseResponse = await gSSP.base<typeof pathname>(ctx);

  if ('props' in baseResponse) {
    const tokenData = await fetchApi({
      resource: 'token',
      pathParams: { hash: getQueryParamString(ctx.query.hash) },
      timeout: 500,
    });

    (await baseResponse.props).apiData = tokenData && tokenData.symbol ? {
      symbol: tokenData.symbol,
    } : undefined;
  }
  return baseResponse;
};
