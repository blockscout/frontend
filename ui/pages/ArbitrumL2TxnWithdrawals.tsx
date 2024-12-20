import { Text } from '@chakra-ui/react';
import React from 'react';

import PageTitle from 'ui/shared/Page/PageTitle';

const ArbitrumL2TxnWithdrawals = () => {
  return (
    <>
      <PageTitle title="Transaction withdrawals" withTextAd/>
      <Text>L2 to L1 message relayer: search for your L2 transaction to execute a manual withdrawal.</Text>
    </>
  );
};

export default React.memo(ArbitrumL2TxnWithdrawals);
