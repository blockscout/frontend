import type { GetServerSideProps, NextPage } from 'next';
import React from 'react';

import type { Route } from 'nextjs-routes';
import type { Props } from 'nextjs/getServerSideProps';
import * as gSSP from 'nextjs/getServerSideProps';
import PageNextJs from 'nextjs/PageNextJs';
import detectBotRequest from 'nextjs/utils/detectBotRequest';
import fetchApi from 'nextjs/utils/fetchApi';

import config from 'configs/app';
import getQueryParamString from 'lib/router/getQueryParamString';
import Token from 'ui/pages/Token';

const pathname: Route['pathname'] = '/token/[hash]';

const Page: NextPage<Props<typeof pathname>> = (props: Props<typeof pathname>) => {
  return (
    <PageNextJs pathname="/token/[hash]" query={ props.query } apiData={ props.apiData }>
      <Token/>
    </PageNextJs>
  );
};

export default Page;

export const getServerSideProps: GetServerSideProps<Props<typeof pathname>> = async(ctx) => {
  const baseResponse = await gSSP.base<typeof pathname>(ctx);

  if ('props' in baseResponse) {
    if (
      config.meta.seo.enhancedDataEnabled ||
      (config.meta.og.enhancedDataEnabled && detectBotRequest(ctx.req)?.type === 'social_preview')
    ) {
      const tokenData = await fetchApi({
        resource: 'token',
        pathParams: { hash: getQueryParamString(ctx.query.hash) },
        timeout: 500,
      });

      (await baseResponse.props).apiData = tokenData ?? null;
    }
  }

  return baseResponse;
};
