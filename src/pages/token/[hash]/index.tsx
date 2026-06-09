// SPDX-License-Identifier: LicenseRef-Blockscout

import type { GetServerSideProps, NextPage } from 'next';
import type { Route } from 'nextjs-routes';
import React from 'react';

import type { Props } from 'src/server/getServerSideProps/handlers';
import * as gSSP from 'src/server/getServerSideProps/main';
import PageNextJs from 'src/server/PageNextJs';
import detectBotRequest from 'src/server/utils/detectBotRequest';
import fetchApi from 'src/server/utils/fetchApi';

import Token from 'src/slices/token/pages/details/Token';

import config from 'src/config';
import getQueryParamString from 'src/shared/router/get-query-param-string';

const pathname: Route['pathname'] = '/token/[hash]';

const Page: NextPage<Props<typeof pathname>> = (props: Props<typeof pathname>) => {
  return (
    <PageNextJs pathname={ pathname } query={ props.query } apiData={ props.apiData }>
      <Token/>
    </PageNextJs>
  );
};

export default Page;

export const getServerSideProps: GetServerSideProps<Props<typeof pathname>> = async(ctx) => {
  const baseResponse = await gSSP.token<typeof pathname>(ctx);

  if ('props' in baseResponse && !config.features.multichain.isEnabled) {
    if (
      config.metadata.seo.enhancedDataEnabled ||
      (config.metadata.og.enhancedDataEnabled && detectBotRequest(ctx.req)?.type === 'social_preview')
    ) {
      const tokenData = await fetchApi({
        resource: 'core:token',
        pathParams: { hash: getQueryParamString(ctx.query.hash) },
        timeout: 500,
      });
      const apiData = tokenData ? {
        ...tokenData,
        symbol_or_name: tokenData.symbol ?? tokenData.name ?? '',
      } : null;

      (await baseResponse.props).apiData = apiData;
    }
  }

  return baseResponse;
};
