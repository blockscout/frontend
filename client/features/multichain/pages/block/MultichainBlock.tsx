// SPDX-License-Identifier: LicenseRef-Blockscout

import { useRouter } from 'next/router';
import React from 'react';

import Block from 'client/slices/block/pages/details/Block';

import { MultichainProvider } from 'client/features/multichain/contexts/multichain';

import getQueryParamString from 'client/shared/router/get-query-param-string';

import multichainConfig from 'configs/multichain';

const MultichainBlock = () => {
  const router = useRouter();
  const chainSlugOrId = getQueryParamString(router.query.chain_slug_or_id);
  const chainData = multichainConfig()?.chains.find(chain => chain.slug === chainSlugOrId || chain.id === chainSlugOrId);

  return (
    <MultichainProvider chainId={ chainData?.id }>
      <Block/>
    </MultichainProvider>
  );
};

export default React.memo(MultichainBlock);
