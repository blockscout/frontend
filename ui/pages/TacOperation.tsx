import React from 'react';

import { useAppContext } from 'lib/contexts/app';
import TacOperationDetails from 'ui/operation/tac/TacOperationDetails';
import TextAd from 'ui/shared/ad/TextAd';
import PageTitle from 'ui/shared/Page/PageTitle';

const TacOperation = () => {
  const appProps = useAppContext();

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

  return (
    <>
      <TextAd mb={ 6 }/>
      <PageTitle
        title="Operation page"
        backLink={ backLink }
        isLoading={ false }
      />
      <TacOperationDetails isLoading={ false }/>
    </>
  );
};

export default React.memo(TacOperation);
