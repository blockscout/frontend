// SPDX-License-Identifier: LicenseRef-Blockscout

import config from 'client/config';
import type { GetServerSideProps } from 'next';
import dynamic from 'next/dynamic';
import fetch from 'node-fetch';
import React from 'react';

import type { MarketplaceApp } from 'client/features/marketplace/types/client';
import type { NextPageWithLayout } from 'nextjs/types';

import type { Route } from 'nextjs-routes';
import type { Props } from 'nextjs/getServerSideProps/handlers';
import * as gSSP from 'nextjs/getServerSideProps/main';
import PageNextJs from 'nextjs/PageNextJs';
import detectBotRequest from 'nextjs/utils/detectBotRequest';
import fetchApi from 'nextjs/utils/fetchApi';

import LayoutApp from 'client/shell/layout/LayoutApp';

import getQueryParamString from 'client/shared/router/get-query-param-string';

const MarketplaceAppPage = dynamic(() => import('client/features/marketplace/pages/dapp/MarketplaceApp'), { ssr: false });

const pathname: Route['pathname'] = '/apps/[id]';
const feature = config.features.marketplace;

const Page: NextPageWithLayout<Props<typeof pathname>> = (props: Props<typeof pathname>) => {
  return (
    <PageNextJs pathname={ pathname } query={ props.query } apiData={ props.apiData }>
      <MarketplaceAppPage/>
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
          const controller = new AbortController();
          const timeout = setTimeout(() => {
            controller.abort();
          }, 1_000);

          try {
            const response = await fetch(feature.configUrl, { signal: controller.signal });
            const appList = await response.json() as Array<MarketplaceApp>;
            clearTimeout(timeout);

            if (appList && Array.isArray(appList)) {
              return appList.find(app => app.id === getQueryParamString(ctx.query.id));
            }
          } catch (error) {} finally {
            clearTimeout(timeout);
          }
        } else {
          return await fetchApi({
            resource: 'admin:marketplace_dapp',
            pathParams: { dappId: getQueryParamString(ctx.query.id), instanceId: config.apis.admin?.instanceId },
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
