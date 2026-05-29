// SPDX-License-Identifier: LicenseRef-Blockscout

import { useRouter } from 'next/router';
import React from 'react';

import useApiQuery from 'src/api/hooks/useApiQuery';

import PageTitle from 'src/shell/page/title/PageTitle';

import TextAd from 'src/features/ads/text/components/TextAd';
import TxEntityZetaChainCC from 'src/features/chain-variants/zeta-chain/components/TxEntityZetaChainCC';
import { ZETA_CHAIN_CCTX } from 'src/features/chain-variants/zeta-chain/stubs';

import throwOnResourceLoadError from 'src/shared/errors/throw-on-resource-load-error';
import getQueryParamString from 'src/shared/router/get-query-param-string';

import ZetaChainCCTXDetails from './ZetaChainCCTXDetails';

const ZetaChainCCTX = () => {
  const router = useRouter();

  const hash = getQueryParamString(router.query.hash);

  const cctxQuery = useApiQuery('zetachain:transaction', {
    queryParams: { cctx_id: hash },
    queryOptions: {
      placeholderData: ZETA_CHAIN_CCTX,
    },
  });

  throwOnResourceLoadError(cctxQuery);

  return (
    <>
      <TextAd mb={ 6 }/>
      <PageTitle
        title="Cross-chain tx details"
        secondRow={ <TxEntityZetaChainCC hash={ hash } noLink variant="subheading" mr={{ base: 0, lg: 2 }}/> }
      />
      <ZetaChainCCTXDetails data={ cctxQuery.data } isLoading={ cctxQuery.isPlaceholderData }/>
    </>
  );
};

export default ZetaChainCCTX;
