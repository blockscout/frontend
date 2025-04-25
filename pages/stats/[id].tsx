import type { GetServerSideProps, NextPage } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';

import type { Route } from 'nextjs-routes';
import * as gSSP from 'nextjs/getServerSideProps';
import type { Props } from 'nextjs/getServerSideProps';
import PageNextJs from 'nextjs/PageNextJs';
import detectBotRequest from 'nextjs/utils/detectBotRequest';
import fetchApi from 'nextjs/utils/fetchApi';

import config from 'configs/app';
import dayjs from 'lib/date/dayjs';
import getQueryParamString from 'lib/router/getQueryParamString';

const Chart = dynamic(() => import('ui/pages/Chart'), { ssr: false });

const pathname: Route['pathname'] = '/stats/[id]';

const Page: NextPage<Props<typeof pathname>> = (props: Props<typeof pathname>) => {
  return (
    <PageNextJs pathname={ pathname } query={ props.query } apiData={ props.apiData }>
      <Chart/>
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
