import { useRouter } from 'next/router';
import React from 'react';

import { useAppContext } from 'lib/contexts/app';
import getQueryParamString from 'lib/router/getQueryParamString';
import TacOperationDetails from 'ui/operation/tac/TacOperationDetails';
import TextAd from 'ui/shared/ad/TextAd';
import OperationEntity from 'ui/shared/entities/operation/OperationEntity';
import PageTitle from 'ui/shared/Page/PageTitle';

const TacOperation = () => {
  const appProps = useAppContext();
  const router = useRouter();
  const hash = getQueryParamString(router.query.hash);

  const backLink = React.useMemo(() => {
    const hasGoBackLink = appProps.referrer && appProps.referrer.endsWith('/operations');

    if (!hasGoBackLink) {
      return;
    }

    return {
      label: 'Back to operations list',
      url: appProps.referrer,
    };
  }, [ appProps.referrer ]);

  const titleSecondRow = (
    <OperationEntity hash={ hash } noLink variant="subheading"/>
  );

  return (
    <>
      <TextAd mb={ 6 }/>
      <PageTitle
        title="Operation page"
        backLink={ backLink }
        isLoading={ false }
        secondRow={ titleSecondRow }
      />
      <TacOperationDetails isLoading={ false }/>
    </>
  );
};

export default React.memo(TacOperation);
