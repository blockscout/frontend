import React from 'react';

import Page from 'ui/shared/Page/Page';
import PageTitle from 'ui/shared/Page/PageTitle';
import TokensList from 'ui/tokens/Tokens';

const Tokens = () => {
  return (
    <Page>
      <PageTitle title="Tokens" withTextAd/>
      <TokensList/>
    </Page>
  );
};

export default Tokens;
