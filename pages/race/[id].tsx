import type { GetServerSideProps } from 'next';
import dynamic from 'next/dynamic';
import React from 'react';

import type { NextPageWithLayout } from 'nextjs/types';
import type { MarketplaceAppOverview } from 'types/client/marketplace';

import type { Route } from 'nextjs-routes';
import * as gSSP from 'nextjs/getServerSideProps';
import type { Props } from 'nextjs/getServerSideProps';
import PageNextJs from 'nextjs/PageNextJs';
import detectBotRequest from 'nextjs/utils/detectBotRequest';
import fetchApi from 'nextjs/utils/fetchApi';

import config from 'configs/app';
import getQueryParamString from 'lib/router/getQueryParamString';
import LayoutApp from 'ui/shared/layout/LayoutApp';

const MarketplaceApp = dynamic(() => import('ui/pages/MarketplaceApp'), { ssr: false });

const pathname: Route['pathname'] = '/apps/[id]';
const feature = config.features.marketplace;

const Page: NextPageWithLayout<Props<typeof pathname>> = (props: Props<typeof pathname>) => {
  return (
    <PageNextJs pathname="/apps/[id]" query={ props.query } apiData={ props.apiData }>
      <MarketplaceApp/>
    </PageNextJs>
  );
};

Page.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <LayoutApp>
      { page }
    </LayoutApp>
  );
};

export default Page;

export const getServerSideProps: GetServerSideProps<Props<typeof pathname>> = async(ctx) => {
  const baseResponse = await gSSP.marketplace<typeof pathname>(ctx);

  if (config.meta.og.enhancedDataEnabled && 'props' in baseResponse && feature.isEnabled) {
    const botInfo = detectBotRequest(ctx.req);

    if (botInfo?.type === 'social_preview') {

      const appData = await(async() => {
        if ('configUrl' in feature) {
          const appList = await fetchApi<never, Array<MarketplaceAppOverview>>({
            url: config.app.baseUrl + feature.configUrl,
            route: '/marketplace_config',
            timeout: 1_000,
          });

          if (appList && Array.isArray(appList)) {
            return appList.find(app => app.id === getQueryParamString(ctx.query.id));
          }

        } else {
          return await fetchApi({
            resource: 'marketplace_dapp',
            pathParams: { dappId: getQueryParamString(ctx.query.id), chainId: config.chain.id },
            timeout: 1_000,
          });
        }
      })();

      (await baseResponse.props).apiData = appData && appData.title ? {
        app_name: appData.title,
      } : null;
    }
  }

  return baseResponse;
};
