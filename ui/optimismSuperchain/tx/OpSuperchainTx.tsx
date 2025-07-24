import React from 'react';

import TextAd from 'ui/shared/ad/TextAd';
import PageTitle from 'ui/shared/Page/PageTitle';

const OpSuperchainTx = () => {
  return (
    <>
      <TextAd mb={ 6 }/>
      <PageTitle
        title="Cross-chain tx details"
      />
      <div>Coming soon 🔜</div>
    </>
  );
};

export default React.memo(OpSuperchainTx);
