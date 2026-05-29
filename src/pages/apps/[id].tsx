// SPDX-License-Identifier: LicenseRef-Blockscout

import type { GetServerSideProps } from 'next';
import dynamic from 'next/dynamic';
import fetch from 'node-fetch';
import React from 'react';

import type { MarketplaceApp } from 'src/features/marketplace/types/client';
import type { NextPageWithLayout } from 'src/server/types';

import type { Route } from 'nextjs-routes';
import type { Props } from 'src/server/getServerSideProps/handlers';
import * as gSSP from 'src/server/getServerSideProps/main';
import PageNextJs from 'src/server/PageNextJs';
import detectBotRequest from 'src/server/utils/detectBotRequest';
import fetchApi from 'src/server/utils/fetchApi';

import LayoutApp from 'src/shell/layout/LayoutApp';

import config from 'src/config';
import getQueryParamString from 'src/shared/router/get-query-param-string';

const MarketplaceAppPage = dynamic(() => import('src/features/marketplace/pages/dapp/MarketplaceApp'), { ssr: false });

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

  if (config.metadata.og.enhancedDataEnabled && 'props' in baseResponse && feature.isEnabled) {
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
