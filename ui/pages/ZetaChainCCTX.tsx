import { useRouter } from 'next/router';
import React from 'react';

import useApiQuery from 'lib/api/useApiQuery';
import { useAppContext } from 'lib/contexts/app';
import throwOnResourceLoadError from 'lib/errors/throwOnResourceLoadError';
import getQueryParamString from 'lib/router/getQueryParamString';
import { zetaChainCCTX } from 'mocks/zetaChain/zetaChainCCTX';
import TextAd from 'ui/shared/ad/TextAd';
import TxEntity from 'ui/shared/entities/tx/TxEntity';
import PageTitle from 'ui/shared/Page/PageTitle';
import ZetaChainCCTXDetails from 'ui/txs/zetaChain/ZetaChainCCTXDetails';

const ZetaChainCCTX = () => {
  const router = useRouter();
  const appProps = useAppContext();

  const hash = getQueryParamString(router.query.hash);

  const cctxQuery = useApiQuery('zetachain:transaction', {
    queryParams: { cctx_id: hash },
    queryOptions: {
      placeholderData: zetaChainCCTX,
    },
  });

  throwOnResourceLoadError(cctxQuery);

  const backLink = React.useMemo(() => {
    const hasGoBackLink = appProps.referrer && appProps.referrer.includes('/txs') && (
      appProps.referrer.includes('tab=cctx_pending') ||
      appProps.referrer.includes('tab=cctx_mined') ||
      appProps.referrer.includes('tab=cross_chain') ||
      !appProps.referrer.includes('tab')
    );

    if (!hasGoBackLink) {
      return;
    }

    return {
      label: 'Back to crass-chain transactions list',
      url: appProps.referrer,
    };
  }, [ appProps.referrer ]);

  return (
    <>
      <TextAd mb={ 6 }/>
      <PageTitle
        title="Cross-chain tx details"
        backLink={ backLink }
        secondRow={ <TxEntity hash={ hash } noLink noIcon noCopy={ false } variant="subheading" mr={{ base: 0, lg: 2 }}/> }
      />
      <ZetaChainCCTXDetails data={ cctxQuery.data } isLoading={ cctxQuery.isPlaceholderData }/>
    </>
  );
};

export default ZetaChainCCTX;
