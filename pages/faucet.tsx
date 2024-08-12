import type { NextPage } from 'next';
import React from 'react';

import PageNextJs from 'nextjs/PageNextJs';

import Join_detail from 'ui/faucet/Join_detail';

const faucet: NextPage = () => {
  return (
    <PageNextJs pathname="/faucet">
      <Join_detail></Join_detail>
    </PageNextJs>
  );
};

export default React.memo(faucet);
