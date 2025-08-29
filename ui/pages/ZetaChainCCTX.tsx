import { useRouter } from 'next/router';
import React from 'react';

import useApiQuery from 'lib/api/useApiQuery';
import throwOnResourceLoadError from 'lib/errors/throwOnResourceLoadError';
import getQueryParamString from 'lib/router/getQueryParamString';
import { zetaChainCCTX } from 'mocks/zetaChain/zetaChainCCTX';
import TextAd from 'ui/shared/ad/TextAd';
import CCTxEntityZetaChain from 'ui/shared/entities/tx/CCTxEntityZetaChain';
import PageTitle from 'ui/shared/Page/PageTitle';
import ZetaChainCCTXDetails from 'ui/txs/zetaChain/ZetaChainCCTXDetails';

const ZetaChainCCTX = () => {
  const router = useRouter();

  const hash = getQueryParamString(router.query.hash);

  const cctxQuery = useApiQuery('zetachain:transaction', {
    queryParams: { cctx_id: hash },
    queryOptions: {
      placeholderData: zetaChainCCTX,
    },
  });

  throwOnResourceLoadError(cctxQuery);

  return (
    <>
      <TextAd mb={ 6 }/>
      <PageTitle
        title="Cross-chain tx details"
        secondRow={ <CCTxEntityZetaChain hash={ hash } noLink noCopy={ false } variant="subheading" mr={{ base: 0, lg: 2 }}/> }
      />
      <ZetaChainCCTXDetails data={ cctxQuery.data } isLoading={ cctxQuery.isPlaceholderData }/>
    </>
  );
};

export default ZetaChainCCTX;
