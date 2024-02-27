import { useRouter } from 'next/router';
import React from 'react';

import getQueryParamString from 'lib/router/getQueryParamString';
import TextAd from 'ui/shared/ad/TextAd';
import TxEntity from 'ui/shared/entities/tx/TxEntity';
import PageTitle from 'ui/shared/Page/PageTitle';

const BlobPageContent = () => {
  const router = useRouter();
  const hash = getQueryParamString(router.query.hash);

  const titleSecondRow = (
    <TxEntity hash={ hash } noLink noCopy={ false } fontWeight={ 500 } fontFamily="heading"/>
  );

  return (
    <>
      <TextAd mb={ 6 }/>
      <PageTitle
        title="Blob details"
        secondRow={ titleSecondRow }
      />
    </>
  );
};

export default BlobPageContent;
