// SPDX-License-Identifier: LicenseRef-Blockscout

import { useRouter } from 'next/router';
import React from 'react';

import useApiQuery from 'client/api/hooks/useApiQuery';

import TxEntityZetaChainCC from 'client/features/chain-variants/zeta-chain/components/TxEntityZetaChainCC';
import { ZETA_CHAIN_CCTX } from 'client/features/chain-variants/zeta-chain/stubs';

import throwOnResourceLoadError from 'client/shared/errors/throw-on-resource-load-error';
import getQueryParamString from 'client/shared/router/get-query-param-string';

import TextAd from 'ui/shared/ad/TextAd';
import PageTitle from 'ui/shared/Page/PageTitle';

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
