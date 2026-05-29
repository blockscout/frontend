// SPDX-License-Identifier: LicenseRef-Blockscout

import type { GetServerSideProps, NextPage } from 'next';
import type { Route } from 'nextjs-routes';
import React from 'react';

import type { Props } from 'src/server/getServerSideProps/handlers';
import * as gSSP from 'src/server/getServerSideProps/main';
import PageNextJs from 'src/server/PageNextJs';
import detectBotRequest from 'src/server/utils/detectBotRequest';
import fetchApi from 'src/server/utils/fetchApi';

import TokenInstance from 'src/slices/token/pages/instance/TokenInstance';

import config from 'src/config';
import getQueryParamString from 'src/shared/router/get-query-param-string';

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
  const baseResponse = await gSSP.token<typeof pathname>(ctx);

  if (config.metadata.og.enhancedDataEnabled && 'props' in baseResponse) {
    const botInfo = detectBotRequest(ctx.req);

    if (botInfo?.type === 'social_preview') {
      const tokenData = await fetchApi({
        resource: 'core:token',
        pathParams: { hash: getQueryParamString(ctx.query.hash) },
        timeout: 1_000,
      });

      (await baseResponse.props).apiData = tokenData ? {
        symbol_or_name: tokenData.symbol ?? tokenData.name ?? '',
      } : null;
    }
  }

  return baseResponse;
};
