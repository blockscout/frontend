// SPDX-License-Identifier: LicenseRef-Blockscout

import { useRouter } from 'next/router';
import React from 'react';

import Transaction from 'client/slices/tx/pages/details/Transaction';

import getQueryParamString from 'client/shared/router/get-query-param-string';

import multichainConfig from 'configs/multichain';
import { MultichainProvider } from 'lib/contexts/multichain';

const MultichainTx = () => {
  const router = useRouter();
  const chainSlugOrId = getQueryParamString(router.query.chain_slug_or_id);
  const chainData = multichainConfig()?.chains.find(chain => chain.slug === chainSlugOrId || chain.id === chainSlugOrId);

  return (
    <MultichainProvider chainId={ chainData?.id }>
      <Transaction/>
    </MultichainProvider>
  );
};

export default React.memo(MultichainTx);
