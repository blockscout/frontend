// SPDX-License-Identifier: LicenseRef-Blockscout

import type { GetServerSideProps } from 'next';

import type { MarketplaceDapp } from '@blockscout/admin-rs-types';

import detectBotRequest from 'src/server/utils/detectBotRequest';
import fetchApi from 'src/server/utils/fetchApi';

import config from 'src/config';
import getQueryParamString from 'src/shared/router/get-query-param-string';

import type { Props } from '../../handlers';
import * as gSSP from '../../main';

type Pathname = '/apps/[id]' | '/apps/[id]/info';
const feature = config.features.marketplace;

export const getServerSideProps: GetServerSideProps<Props<Pathname>> = async(ctx) => {
  const baseResponse = await gSSP.marketplace<Pathname>(ctx);

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
            const appList = await response.json() as Array<MarketplaceDapp>;
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

      (await baseResponse.props).apiData = appData ? appData : null;
    }
  }

  return baseResponse;
};
