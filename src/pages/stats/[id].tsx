// SPDX-License-Identifier: LicenseRef-Blockscout

import type { GetServerSideProps, NextPage } from 'next';
import dynamic from 'next/dynamic';
import type { Route } from 'nextjs-routes';
import React from 'react';

import type { Props } from 'src/server/getServerSideProps/handlers';
import * as gSSP from 'src/server/getServerSideProps/main';
import PageNextJs from 'src/server/PageNextJs';
import detectBotRequest from 'src/server/utils/detectBotRequest';
import fetchApi from 'src/server/utils/fetchApi';

import { MultichainProvider } from 'src/features/multichain/context';

import config from 'src/config';
import dayjs from 'src/shared/date-and-time/dayjs';
import getQueryParamString from 'src/shared/router/get-query-param-string';

const ChainStatsDetails = dynamic(() => import('src/features/chain-stats/pages/details/ChainStatsDetails'), { ssr: false });

const pathname: Route['pathname'] = '/stats/[id]';

const Page: NextPage<Props<typeof pathname>> = (props: Props<typeof pathname>) => {
  return (
    <PageNextJs pathname={ pathname } query={ props.query } apiData={ props.apiData }>
      { config.features.multichain.isEnabled ? (
        <MultichainProvider chainId={ getQueryParamString(props.query?.chain_id) }>
          <ChainStatsDetails/>
        </MultichainProvider>
      ) : (
        <ChainStatsDetails/>
      ) }
    </PageNextJs>
  );
};

export default Page;

export const getServerSideProps: GetServerSideProps<Props<typeof pathname>> = async(ctx) => {
  const baseResponse = await gSSP.base<typeof pathname>(ctx);

  if ('props' in baseResponse) {
    if (
      config.metadata.seo.enhancedDataEnabled ||
      (config.metadata.og.enhancedDataEnabled && detectBotRequest(ctx.req)?.type === 'social_preview')
    ) {
      const chartData = await fetchApi({
        resource: 'stats:line',
        pathParams: { id: getQueryParamString(ctx.query.id) },
        queryParams: { from: dayjs().format('YYYY-MM-DD'), to: dayjs().format('YYYY-MM-DD') },
        timeout: 1000,
      });

      (await baseResponse.props).apiData = chartData?.info ?? null;
    }
  }

  return baseResponse;
};
