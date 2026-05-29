// SPDX-License-Identifier: LicenseRef-Blockscout

import type { GetServerSideProps, NextPage } from 'next';
import React from 'react';

import type { Route } from 'nextjs-routes';
import type { Props } from 'src/server/getServerSideProps/handlers';
import * as gSSP from 'src/server/getServerSideProps/main';
import PageNextJs from 'src/server/PageNextJs';
import detectBotRequest from 'src/server/utils/detectBotRequest';
import fetchApi from 'src/server/utils/fetchApi';

import Address from 'src/slices/address/pages/details/Address';

import MultichainAddress from 'src/features/multichain/pages/address/MultichainAddress';

import config from 'src/config';
import getQueryParamString from 'src/shared/router/get-query-param-string';

const pathname: Route['pathname'] = '/address/[hash]';

const Page: NextPage<Props<typeof pathname>> = (props: Props<typeof pathname>) => {
  return (
    <PageNextJs pathname={ pathname } query={ props.query } apiData={ props.apiData }>
      { config.features.multichain.isEnabled ? <MultichainAddress/> : <Address/> }
    </PageNextJs>
  );
};

export default Page;

export const getServerSideProps: GetServerSideProps<Props<typeof pathname>> = async(ctx) => {
  const baseResponse = await gSSP.base<typeof pathname>(ctx);

  if (config.metadata.og.enhancedDataEnabled && 'props' in baseResponse && !config.features.multichain.isEnabled) {
    const botInfo = detectBotRequest(ctx.req);

    if (botInfo?.type === 'social_preview') {
      const addressData = await fetchApi({
        resource: 'general:address',
        pathParams: { hash: getQueryParamString(ctx.query.hash) },
        timeout: 1_000,
      });

      (await baseResponse.props).apiData = addressData && addressData.ens_domain_name ? {
        domain_name: addressData.ens_domain_name,
      } : null;
    }
  }

  return baseResponse;
};
