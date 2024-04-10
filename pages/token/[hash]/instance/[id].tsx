import type { GetServerSideProps, NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';

import type { Props } from 'nextjs/getServerSideProps';
import * as gSSP from 'nextjs/getServerSideProps';
import PageNextJs from 'nextjs/PageNextJs';
import fetchApi from 'nextjs/utils/fetchApi';

import getQueryParamString from 'lib/router/getQueryParamString';

const TokenInstance = dynamic(() => import('ui/pages/TokenInstance'), { ssr: false });

const Page: NextPage<Props<'/token/[hash]/instance/[id]'>> = (props: Props<'/token/[hash]/instance/[id]'>) => {
  return (
    <PageNextJs pathname="/token/[hash]/instance/[id]" query={ props.query } apiData={ props.apiData }>
      <TokenInstance/>
    </PageNextJs>
  );
};

export default Page;

export const getServerSideProps: GetServerSideProps<Props<'/token/[hash]/instance/[id]'>> = async(ctx) => {
  const baseResponse = await gSSP.base(ctx);

  if ('props' in baseResponse) {
    const apiData = await fetchApi({
      resource: 'token',
      pathParams: { hash: getQueryParamString(ctx.query.hash) },
      timeout: 500,
    });

    (await baseResponse.props as Props<'/token/[hash]/instance/[id]'>).apiData = apiData && apiData.symbol ? {
      symbol: apiData.symbol,
    } : undefined;
  }
  return baseResponse;
};
