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
import TokenInstance from 'ui/pages/TokenInstance';

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

  if (config.meta.og.enhancedDataEnabled && 'props' in baseResponse) {
    const botInfo = detectBotRequest(ctx.req);

    if (botInfo?.type === 'social_preview') {
      const tokenData = await fetchApi({
        resource: 'token',
        pathParams: { hash: getQueryParamString(ctx.query.hash) },
        timeout: 1_000,
      });

      (await baseResponse.props).apiData = tokenData && tokenData.symbol ? {
        symbol: tokenData.symbol,
      } : null;
    }
  }

  return baseResponse;
};
