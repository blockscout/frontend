// SPDX-License-Identifier: LicenseRef-Blockscout

import type { GetServerSideProps } from 'next';

import detectBotRequest from 'src/server/utils/detectBotRequest';
import fetchApi from 'src/server/utils/fetchApi';

import getOgDescriptionParams from 'src/slices/tx/utils/get-og-description-params';

import config from 'src/config';
import { getFeaturePayload } from 'src/config/utils/features';
import getQueryParamString from 'src/shared/router/get-query-param-string';

import { SECOND } from 'src/toolkit/utils/consts';

import type { Props } from '../../handlers';
import * as gSSP from '../../main';

type Pathname = '/tx/[hash]' | '/tx/[hash]/receipt';

const API_TIMEOUT = 2 * SECOND;

const PREVIEW_QUERY_PARAMS = { decode_input: 'true', preload_ens: 'true', preload_metadata: 'true' };

export const getServerSideProps: GetServerSideProps<Props<Pathname>> = async(ctx) => {
  const baseResponse = await gSSP.tx<Pathname>(ctx);

  // Only social-preview bots get the enhanced description, and only server-side: crawlers don't run JS,
  // and the SEO tags these routes emit need no API data.
  const isSocialPreviewBot = config.metadata.og.enhancedDataEnabled && detectBotRequest(ctx.req)?.type === 'social_preview';

  const hasBlockscoutInterpretation = getFeaturePayload(config.features.txInterpretation)?.provider === 'blockscout';

  if ('props' in baseResponse && !config.features.multichain.isEnabled && isSocialPreviewBot && hasBlockscoutInterpretation) {
    const hash = getQueryParamString(ctx.query.hash);

    const [ txData, interpretationData ] = await Promise.all([
      fetchApi({ resource: 'core:tx_preview', pathParams: { hash }, queryParams: PREVIEW_QUERY_PARAMS, timeout: API_TIMEOUT }),
      fetchApi({ resource: 'core:tx_interpretation', pathParams: { hash }, timeout: API_TIMEOUT }),
    ]);

    (await baseResponse.props).apiData = getOgDescriptionParams(txData, interpretationData);
  }

  return baseResponse;
};
