import React from 'react';

import PageTitle from 'ui/shared/Page/PageTitle';
import TokensList from 'ui/tokens/Tokens';

const Tokens = () => {
  return (
    <>
      <PageTitle title="Tokens" withTextAd/>
      <TokensList/>
    </>
  );
};

export default Tokens;
