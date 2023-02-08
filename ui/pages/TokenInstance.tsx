import React from 'react';

import Page from 'ui/shared/Page/Page';
import TokenInstanceContent from 'ui/tokenInstance/TokenInstanceContent';

export type TokenTabs = 'token_transfers' | 'holders'

const TokenInstance = () => {

  return (
    <Page>
      <TokenInstanceContent/>
    </Page>
  );
};

export default TokenInstance;
