import React from 'react';

import Page from 'ui/shared/Page/Page';
import PageTitle from 'ui/shared/Page/PageTitle';
import TokensList from 'ui/tokens/Tokens';

const Transactions = () => {
  return (
    <Page>
      <PageTitle text="Tokens" withTextAd/>
      <TokensList/>
    </Page>
  );
};

export default Transactions;
